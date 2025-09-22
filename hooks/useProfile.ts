
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
      console.log('Fetching profile for user:', user?.id);
      
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
        console.log('Profile found:', data);
        setProfile(data);
      } else {
        console.log('No profile found, creating new profile');
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
      console.log('Creating profile for user:', user.id);
      
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

      console.log('Profile created:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in createProfile:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      console.log('Updating profile with:', updates);
      
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

      console.log('Profile updated:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async (type: 'logo' | 'avatar') => {
    try {
      console.log('Starting image picker for type:', type);
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker
      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'logo' ? [16, 9] : [1, 1],
        quality: 0.8,
        base64: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected, starting upload...');
        await uploadImage(result.assets[0].uri, type);
      } else {
        console.log('Image picker was canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const uploadImage = async (uri: string, type: 'logo' | 'avatar') => {
    if (!user) {
      console.error('No user found for upload');
      return;
    }

    try {
      setUploading(true);
      console.log('Starting upload for:', { uri, type, userId: user.id });

      // Convert URI to blob
      console.log('Fetching image from URI...');
      const response = await fetch(uri);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Image blob created, size:', blob.size, 'type:', blob.type);

      // Create file name
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      const bucket = type === 'logo' ? 'logos' : 'avatars';
      
      console.log('Upload details:', { fileName, bucket, fileSize: blob.size });

      // Upload to Supabase Storage
      console.log('Uploading to Supabase Storage...');
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

      console.log('Upload successful:', uploadData);

      // Get public URL
      console.log('Getting public URL...');
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('Public URL data:', urlData);

      if (urlData?.publicUrl) {
        // Update profile with new image URL
        const updateField = type === 'logo' ? 'logo_url' : 'avatar_url';
        console.log('Updating profile with new URL:', { [updateField]: urlData.publicUrl });
        
        await updateProfile({ [updateField]: urlData.publicUrl });
        
        Alert.alert('Success', `${type === 'logo' ? 'Logo' : 'Avatar'} uploaded successfully!`);
      } else {
        console.error('No public URL returned');
        Alert.alert('Error', 'Failed to get image URL');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image: ' + error.message);
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
