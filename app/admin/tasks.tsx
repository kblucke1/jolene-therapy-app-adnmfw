
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockTasks, mockClients, mockVideos, mockExercises } from '../../data/mockData';
import { Task, Client } from '../../types';
import TaskCard from '../../components/TaskCard';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function AdminTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isAssignTaskVisible, setIsAssignTaskVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState<Task['type']>('exercise');
  const [taskContent, setTaskContent] = useState('');

  useEffect(() => {
    setTasks(mockTasks);
    setClients(mockClients);
  }, []);

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      'Task Details',
      `Title: ${task.title}\nType: ${task.type}\nClient: ${getClientName(task.clientId)}\nStatus: ${task.completed ? 'Completed' : 'Pending'}`,
      [
        { text: 'OK' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => handleDeleteTask(task.id)
        }
      ]
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const handleAssignTask = () => {
    if (!selectedClient || !taskTitle.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      type: taskType,
      content: taskContent.trim() || taskDescription.trim(),
      completed: false,
      assignedDate: new Date().toISOString(),
      clientId: selectedClient,
      duration: taskType === 'video' ? 15 : taskType === 'exercise' ? 20 : undefined,
    };

    setTasks(prev => [...prev, newTask]);
    
    // Reset form
    setSelectedClient('');
    setTaskTitle('');
    setTaskDescription('');
    setTaskContent('');
    setTaskType('exercise');
    setIsAssignTaskVisible(false);

    Alert.alert('Success', 'Task assigned successfully!');
  };

  const tasksByClient = tasks.reduce((acc, task) => {
    const clientName = getClientName(task.clientId);
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Task Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAssignTaskVisible(true)}
          >
            <Icon name="add" size={24} color={colors.backgroundAlt} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {Object.entries(tasksByClient).map(([clientName, clientTasks]) => (
            <View key={clientName} style={styles.clientSection}>
              <Text style={styles.clientSectionTitle}>{clientName}</Text>
              {clientTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => handleTaskPress(task)}
                />
              ))}
            </View>
          ))}
          
          {tasks.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="clipboard-outline" size={60} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No tasks assigned yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start by assigning tasks to your clients
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <SimpleBottomSheet
        isVisible={isAssignTaskVisible}
        onClose={() => setIsAssignTaskVisible(false)}
      >
        <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.bottomSheetTitle}>Assign New Task</Text>
          
          {/* Client Selection */}
          <Text style={styles.fieldLabel}>Select Client *</Text>
          <View style={styles.clientSelector}>
            {clients.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientOption,
                  selectedClient === client.id && styles.clientOptionSelected
                ]}
                onPress={() => setSelectedClient(client.id)}
              >
                <Text style={[
                  styles.clientOptionText,
                  selectedClient === client.id && styles.clientOptionTextSelected
                ]}>
                  {client.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Task Type */}
          <Text style={styles.fieldLabel}>Task Type *</Text>
          <View style={styles.typeSelector}>
            {(['video', 'exercise', 'reading', 'reflection'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  taskType === type && styles.typeOptionSelected
                ]}
                onPress={() => setTaskType(type)}
              >
                <Text style={[
                  styles.typeOptionText,
                  taskType === type && styles.typeOptionTextSelected
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={commonStyles.input}
            placeholder="Task Title *"
            value={taskTitle}
            onChangeText={setTaskTitle}
            placeholderTextColor={colors.textLight}
          />
          
          <TextInput
            style={[commonStyles.input, styles.textArea]}
            placeholder="Task Description *"
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textLight}
          />

          <TextInput
            style={[commonStyles.input, styles.textArea]}
            placeholder="Additional Instructions (optional)"
            value={taskContent}
            onChangeText={setTaskContent}
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textLight}
          />
          
          <View style={styles.bottomSheetButtons}>
            <TouchableOpacity
              style={[buttonStyles.outline, styles.cancelButton]}
              onPress={() => setIsAssignTaskVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, styles.assignButton]}
              onPress={handleAssignTask}
            >
              <Text style={styles.assignButtonText}>Assign Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  tasksList: {
    flex: 1,
  },
  clientSection: {
    marginBottom: 24,
  },
  clientSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSheetContent: {
    padding: 20,
    maxHeight: 600,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  clientSelector: {
    marginBottom: 16,
  },
  clientOption: {
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  clientOptionSelected: {
    backgroundColor: colors.primary,
  },
  clientOptionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  clientOptionTextSelected: {
    color: colors.backgroundAlt,
    fontWeight: '600',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    backgroundColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  typeOptionTextSelected: {
    color: colors.backgroundAlt,
    fontWeight: '600',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  assignButton: {
    flex: 1,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
});
