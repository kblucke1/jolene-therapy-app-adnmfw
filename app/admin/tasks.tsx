
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import TaskCard from '../../components/TaskCard';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import SimpleBottomSheet from '../../components/BottomSheet';
import { Task, Client, Video, Exercise, Document } from '../../types';
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
  picker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  pickerButton: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  pickerPlaceholder: {
    color: colors.textSecondary,
  },
  optionsList: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  taskTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  taskTypeButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  taskTypeButtonActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  taskTypeText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  taskTypeTextActive: {
    color: colors.primary,
    fontWeight: '600',
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

const taskTypes = [
  { id: 'video', label: 'Video', icon: 'video' },
  { id: 'exercise', label: 'Exercise', icon: 'activity' },
  { id: 'reading', label: 'Reading', icon: 'book' },
  { id: 'reflection', label: 'Reflection', icon: 'edit' },
  { id: 'photo_submission', label: 'Photo Task', icon: 'camera' },
  { id: 'document', label: 'Document', icon: 'file-text' },
];

export default function AdminTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showContentPicker, setShowContentPicker] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as Task['type'],
    content: '',
    duration: '',
    dueDate: '',
    clientId: '',
    contentId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResult, clientsResult, videosResult, exercisesResult, documentsResult] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'client'),
        supabase.from('videos').select('*'),
        supabase.from('exercises').select('*'),
        supabase.from('documents').select('*'),
      ]);

      if (tasksResult.error) throw tasksResult.error;
      if (clientsResult.error) throw clientsResult.error;
      if (videosResult.error) throw videosResult.error;
      if (exercisesResult.error) throw exercisesResult.error;
      if (documentsResult.error) throw documentsResult.error;

      setTasks(tasksResult.data || []);
      setClients(clientsResult.data || []);
      setVideos(videosResult.data || []);
      setExercises(exercisesResult.data || []);
      setDocuments(documentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskPress = (task: Task) => {
    console.log('Task pressed:', task);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

              if (error) throw error;
              
              setTasks(tasks.filter(t => t.id !== taskId));
              Alert.alert('Success', 'Task deleted successfully');
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      type: 'video',
      content: '',
      duration: '',
      dueDate: '',
      clientId: '',
      contentId: '',
    });
    setShowBottomSheet(true);
  };

  const handleSaveTask = async () => {
    if (!formData.title.trim() || !formData.clientId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      let content = formData.content;
      
      // Set content based on type and selected content
      if (formData.type === 'video' && formData.contentId) {
        const video = videos.find(v => v.id === formData.contentId);
        content = video?.youtubeUrl || '';
      } else if (formData.type === 'exercise' && formData.contentId) {
        const exercise = exercises.find(e => e.id === formData.contentId);
        content = exercise?.instructions.join('\n') || '';
      } else if (formData.type === 'document' && formData.contentId) {
        const document = documents.find(d => d.id === formData.contentId);
        content = document?.fileUrl || '';
      }

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        content,
        duration: parseInt(formData.duration) || null,
        due_date: formData.dueDate || null,
        client_id: formData.clientId,
      };

      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTask.id);

        if (error) throw error;
        
        Alert.alert('Success', 'Task updated successfully');
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);

        if (error) throw error;
        
        Alert.alert('Success', 'Task assigned successfully');
      }

      setShowBottomSheet(false);
      fetchData();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const getContentOptions = () => {
    switch (formData.type) {
      case 'video':
        return videos.map(v => ({ id: v.id, label: v.title }));
      case 'exercise':
        return exercises.map(e => ({ id: e.id, label: e.title }));
      case 'document':
        return documents.map(d => ({ id: d.id, label: d.title }));
      default:
        return [];
    }
  };

  const getSelectedContentLabel = () => {
    const options = getContentOptions();
    const selected = options.find(o => o.id === formData.contentId);
    return selected ? selected.label : 'Select content';
  };

  const needsContentSelection = ['video', 'exercise', 'document'].includes(formData.type);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyStateText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Icon name="plus" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="clipboard" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No tasks assigned yet.{'\n'}Tap the + button to assign your first task.
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => handleTaskPress(task)}
              onDelete={() => handleDeleteTask(task.id)}
              showClient={true}
              clientName={getClientName(task.clientId)}
            />
          ))
        )}
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>
            {editingTask ? 'Edit Task' : 'Assign New Task'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Task Title *"
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

          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
            Task Type *
          </Text>
          <View style={styles.taskTypeGrid}>
            {taskTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.taskTypeButton,
                  formData.type === type.id && styles.taskTypeButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, type: type.id as Task['type'], contentId: '' })}
              >
                <Icon
                  name={type.icon}
                  size={20}
                  color={formData.type === type.id ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.taskTypeText,
                    formData.type === type.id && styles.taskTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Client Picker */}
          <View style={styles.picker}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowClientPicker(!showClientPicker)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !formData.clientId && styles.pickerPlaceholder,
                ]}
              >
                {formData.clientId
                  ? getClientName(formData.clientId)
                  : 'Select Client *'}
              </Text>
              <Icon name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            {showClientPicker && (
              <ScrollView style={styles.optionsList}>
                {clients.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    style={styles.optionItem}
                    onPress={() => {
                      setFormData({ ...formData, clientId: client.id });
                      setShowClientPicker(false);
                    }}
                  >
                    <Text style={styles.optionText}>{client.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Content Picker for specific types */}
          {needsContentSelection && (
            <View style={styles.picker}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowContentPicker(!showContentPicker)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    !formData.contentId && styles.pickerPlaceholder,
                  ]}
                >
                  {getSelectedContentLabel()}
                </Text>
                <Icon name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              {showContentPicker && (
                <ScrollView style={styles.optionsList}>
                  {getContentOptions().map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.optionItem}
                      onPress={() => {
                        setFormData({ ...formData, contentId: option.id });
                        setShowContentPicker(false);
                      }}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Manual content input for reading/reflection/photo tasks */}
          {!needsContentSelection && (
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={
                formData.type === 'reading'
                  ? 'Reading material or instructions'
                  : formData.type === 'reflection'
                  ? 'Reflection prompts or questions'
                  : 'Task instructions'
              }
              placeholderTextColor={colors.textSecondary}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              multiline
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            placeholderTextColor={colors.textSecondary}
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Due Date (YYYY-MM-DD)"
            placeholderTextColor={colors.textSecondary}
            value={formData.dueDate}
            onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBottomSheet(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {editingTask ? 'Update' : 'Assign'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
