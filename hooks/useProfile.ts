
import { useState, useEffect } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import { useAuth } from './useAuth';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  role: 'admin' | 'client';
  avatar_url: string | null;
  logo_url: string | null;
  practice_name: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        await createProfile();
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: user.user_metadata?.name || null,
          email: user.email,
          role: user.email?.includes('admin') ? 'admin' : 'client',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile');
        return;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async (type: 'logo' | 'avatar') => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'logo' ? [16, 9] : [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri, type);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string, type: 'logo' | 'avatar') => {
    if (!user) return;

    try {
      setUploading(true);

      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create file name
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      const bucket = type === 'logo' ? 'logos' : 'avatars';

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert('Upload Error', uploadError.message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        // Update profile with new image URL
        const updateField = type === 'logo' ? 'logo_url' : 'avatar_url';
        await updateProfile({ [updateField]: urlData.publicUrl });
        
        Alert.alert('Success', `${type === 'logo' ? 'Logo' : 'Avatar'} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return {
    profile,
    loading,
    uploading,
    updateProfile,
    pickImage,
    fetchProfile,
  };
}
