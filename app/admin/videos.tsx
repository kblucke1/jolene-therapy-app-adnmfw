
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import SimpleBottomSheet from '../../components/BottomSheet';
import { Video } from '../../types';
import { supabase } from '../integrations/supabase/client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  videoUrl: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 8,
  },
  videoDuration: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: colors.primary + '20',
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.border,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButtonText: {
    color: colors.surface,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default function AdminVideosScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      Alert.alert('Error', 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: '',
    });
    setShowBottomSheet(true);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      youtubeUrl: video.youtubeUrl,
      duration: video.duration.toString(),
    });
    setShowBottomSheet(true);
  };

  const handleDeleteVideo = (videoId: string) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', videoId);

              if (error) throw error;
              
              setVideos(videos.filter(v => v.id !== videoId));
              Alert.alert('Success', 'Video deleted successfully');
            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const handleSaveVideo = async () => {
    if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        youtube_url: formData.youtubeUrl.trim(),
        duration: parseInt(formData.duration) || 0,
      };

      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', editingVideo.id);

        if (error) throw error;
        
        Alert.alert('Success', 'Video updated successfully');
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([videoData]);

        if (error) throw error;
        
        Alert.alert('Success', 'Video added successfully');
      }

      setShowBottomSheet(false);
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Error', 'Failed to save video');
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (youtubeUrl: string) => {
    const videoId = extractYouTubeId(youtubeUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyStateText}>Loading videos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meditation Videos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddVideo}>
          <Icon name="plus" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="video" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No meditation videos yet.{'\n'}Tap the + button to add your first video.
            </Text>
          </View>
        ) : (
          videos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              {video.description && (
                <Text style={styles.videoDescription}>{video.description}</Text>
              )}
              <Text style={styles.videoUrl}>{video.youtubeUrl}</Text>
              <Text style={styles.videoDuration}>{video.duration} minutes</Text>
              
              <View style={styles.videoActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditVideo(video)}
                >
                  <Icon name="edit" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteVideo(video.id)}
                >
                  <Icon name="trash" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Video Title *"
            placeholderTextColor={colors.textSecondary}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor={colors.textSecondary}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="YouTube URL *"
            placeholderTextColor={colors.textSecondary}
            value={formData.youtubeUrl}
            onChangeText={(text) => setFormData({ ...formData, youtubeUrl: text })}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            placeholderTextColor={colors.textSecondary}
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
            keyboardType="numeric"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBottomSheet(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveVideo}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {editingVideo ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
