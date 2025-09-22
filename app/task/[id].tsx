
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Icon from '../../components/Icon';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { Task, PhotoSubmission } from '../../types';
import { supabase } from '../integrations/supabase/client';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  taskHeader: {
    marginBottom: 24,
  },
  taskTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  taskType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTypeIcon: {
    marginRight: 8,
  },
  taskTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  instructionsList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
    minWidth: 24,
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  videoContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  videoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  photoSubmissionSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  photoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submittedPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    textAlignVertical: 'top',
    height: 80,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  completeButtonCompleted: {
    backgroundColor: colors.textSecondary,
  },
  completeButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  documentButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [photoSubmission, setPhotoSubmission] = useState<PhotoSubmission | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (taskError) throw taskError;
      setTask(taskData);

      // If it's a photo submission task, check for existing submission
      if (taskData.type === 'photo_submission') {
        const { data: submissionData, error: submissionError } = await supabase
          .from('photo_submissions')
          .select('*')
          .eq('task_id', id)
          .eq('client_id', user?.id)
          .single();

        if (submissionData) {
          setPhotoSubmission(submissionData);
          setNotes(submissionData.notes || '');
        }
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      Alert.alert('Error', 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);

      if (error) throw error;

      setTask({ ...task, completed: !task.completed });
      Alert.alert('Success', task.completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadPhoto = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const fileExt = uri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `photo-submissions/${fileName}`;

      const { data, error } = await supabase.storage
        .from('photo-submissions')
        .upload(filePath, blob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('photo-submissions')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const submitPhoto = async () => {
    if (!selectedPhoto || !task || !user) return;

    try {
      const photoUrl = await uploadPhoto(selectedPhoto);

      const submissionData = {
        task_id: task.id,
        client_id: user.id,
        photo_url: photoUrl,
        notes: notes.trim(),
      };

      if (photoSubmission) {
        const { error } = await supabase
          .from('photo_submissions')
          .update(submissionData)
          .eq('id', photoSubmission.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('photo_submissions')
          .insert([submissionData])
          .select()
          .single();

        if (error) throw error;
        setPhotoSubmission(data);
      }

      setSelectedPhoto(null);
      Alert.alert('Success', 'Photo submitted successfully!');
      fetchTask(); // Refresh to get updated submission
    } catch (error) {
      console.error('Error submitting photo:', error);
      Alert.alert('Error', 'Failed to submit photo');
    }
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'video':
        return 'video';
      case 'exercise':
        return 'activity';
      case 'reading':
        return 'book';
      case 'reflection':
        return 'edit';
      case 'photo_submission':
        return 'camera';
      case 'document':
        return 'file-text';
      default:
        return 'clipboard';
    }
  };

  const getTaskTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'video':
        return colors.primary;
      case 'exercise':
        return colors.success;
      case 'reading':
        return colors.warning;
      case 'reflection':
        return colors.info;
      case 'photo_submission':
        return colors.secondary;
      case 'document':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getTaskTypeLabel = (type: Task['type']) => {
    switch (type) {
      case 'video':
        return 'Meditation Video';
      case 'exercise':
        return 'Physical Exercise';
      case 'reading':
        return 'Reading Material';
      case 'reflection':
        return 'Reflection Exercise';
      case 'photo_submission':
        return 'Photo Submission';
      case 'document':
        return 'Document';
      default:
        return 'Task';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getThumbnailUrl = (youtubeUrl: string) => {
    const videoId = extractYouTubeId(youtubeUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const renderTaskContent = () => {
    if (!task) return null;

    switch (task.type) {
      case 'video':
        const thumbnailUrl = getThumbnailUrl(task.content);
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Watch Video</Text>
            <View style={styles.videoContainer}>
              {thumbnailUrl && (
                <Image source={{ uri: thumbnailUrl }} style={styles.videoThumbnail} />
              )}
              <TouchableOpacity 
                style={styles.videoButton}
                onPress={() => {
                  // Open YouTube video
                  console.log('Opening video:', task.content);
                }}
              >
                <Icon name="play" size={20} color={colors.surface} />
                <Text style={styles.videoButtonText}>Watch on YouTube</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'exercise':
        const instructions = task.content.split('\n').filter(line => line.trim());
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercise Instructions</Text>
            <View style={styles.instructionsList}>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <Text style={styles.instructionNumber}>{index + 1}.</Text>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'photo_submission':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo Submission</Text>
            <View style={styles.photoSubmissionSection}>
              {photoSubmission?.photoUrl ? (
                <>
                  <Image source={{ uri: photoSubmission.photoUrl }} style={styles.submittedPhoto} />
                  <Text style={{ color: colors.success, textAlign: 'center', marginBottom: 16 }}>
                    Photo submitted successfully!
                  </Text>
                </>
              ) : selectedPhoto ? (
                <>
                  <Image source={{ uri: selectedPhoto }} style={styles.submittedPhoto} />
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add notes about your photo (optional)"
                    placeholderTextColor={colors.textSecondary}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={submitPhoto}>
                    <Text style={styles.submitButtonText}>Submit Photo</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  <Icon name="camera" size={20} color={colors.surface} />
                  <Text style={styles.photoButtonText}>Take or Select Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 'document':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document</Text>
            <TouchableOpacity 
              style={styles.documentButton}
              onPress={() => {
                // Open document
                console.log('Opening document:', task.content);
              }}
            >
              <Icon name="file-text" size={20} color={colors.surface} />
              <Text style={styles.documentButtonText}>Open Document</Text>
            </TouchableOpacity>
          </View>
        );

      case 'reading':
      case 'reflection':
      default:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {task.type === 'reflection' ? 'Reflection Prompts' : 'Instructions'}
            </Text>
            <Text style={styles.description}>{task.content}</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Task not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            
            <View style={styles.taskType}>
              <View style={styles.taskTypeIcon}>
                <Icon 
                  name={getTaskIcon(task.type)} 
                  size={20} 
                  color={getTaskTypeColor(task.type)} 
                />
              </View>
              <Text style={[styles.taskTypeText, { color: getTaskTypeColor(task.type) }]}>
                {getTaskTypeLabel(task.type)}
              </Text>
            </View>

            <View style={styles.taskMeta}>
              {task.duration && (
                <View style={styles.metaItem}>
                  <Icon name="clock" size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{task.duration} minutes</Text>
                </View>
              )}
              
              <View style={styles.metaItem}>
                <Icon name="calendar" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>
                  Assigned {formatDate(task.assignedDate)}
                </Text>
              </View>

              {task.dueDate && (
                <View style={styles.metaItem}>
                  <Icon name="flag" size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>
                    Due {formatDate(task.dueDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {task.description && (
            <Text style={styles.description}>{task.description}</Text>
          )}

          {renderTaskContent()}

          <TouchableOpacity
            style={[
              styles.completeButton,
              task.completed && styles.completeButtonCompleted,
            ]}
            onPress={handleToggleComplete}
          >
            <Icon
              name={task.completed ? "check-circle" : "circle"}
              size={24}
              color={colors.surface}
            />
            <Text style={styles.completeButtonText}>
              {task.completed ? 'Completed' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
