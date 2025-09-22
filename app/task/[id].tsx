
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockTasks } from '../../data/mockData';
import { Task } from '../../types';
import Icon from '../../components/Icon';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const foundTask = mockTasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
    } else {
      Alert.alert('Error', 'Task not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [id]);

  const handleToggleComplete = () => {
    if (!task) return;
    
    setTask(prev => prev ? { ...prev, completed: !prev.completed } : null);
    
    Alert.alert(
      'Success',
      task.completed ? 'Task marked as incomplete' : 'Task completed! Great job!',
      [{ text: 'OK' }]
    );
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'video':
        return 'play-circle-outline';
      case 'exercise':
        return 'fitness-outline';
      case 'reading':
        return 'book-outline';
      case 'reflection':
        return 'journal-outline';
      default:
        return 'document-outline';
    }
  };

  const getTaskTypeColor = (type: Task['type']) => {
    switch (type) {
      case 'video':
        return colors.danger;
      case 'exercise':
        return colors.accent;
      case 'reading':
        return colors.primary;
      case 'reflection':
        return colors.secondary;
      default:
        return colors.textLight;
    }
  };

  if (!task) {
    return (
      <SafeAreaView style={commonStyles.centerContent}>
        <Text style={commonStyles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Task Header */}
        <View style={styles.taskHeader}>
          <View style={styles.taskIconContainer}>
            <Icon 
              name={getTaskIcon(task.type)} 
              size={48} 
              color={getTaskTypeColor(task.type)} 
            />
          </View>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.taskTypeContainer}>
            <Text style={[styles.taskType, { color: getTaskTypeColor(task.type) }]}>
              {task.type.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Task Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon 
              name={task.completed ? 'checkmark-circle' : 'time-outline'} 
              size={24} 
              color={task.completed ? colors.success : colors.warning} 
            />
            <Text style={[
              styles.statusText,
              { color: task.completed ? colors.success : colors.warning }
            ]}>
              {task.completed ? 'Completed' : 'In Progress'}
            </Text>
          </View>
          
          {task.duration && (
            <View style={styles.durationContainer}>
              <Icon name="time-outline" size={16} color={colors.textLight} />
              <Text style={styles.durationText}>
                Estimated time: {task.duration} minutes
              </Text>
            </View>
          )}
          
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Icon name="calendar-outline" size={16} color={colors.textLight} />
              <Text style={styles.dueDateText}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Task Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{task.description}</Text>
        </View>

        {/* Task Content/Instructions */}
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>
            {task.type === 'video' ? 'Video Content' : 
             task.type === 'exercise' ? 'Exercise Instructions' :
             task.type === 'reading' ? 'Reading Material' :
             'Reflection Prompts'}
          </Text>
          <Text style={styles.contentText}>{task.content}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {task.type === 'video' && (
            <TouchableOpacity style={[buttonStyles.secondary, styles.actionButton]}>
              <Icon name="play" size={20} color={colors.backgroundAlt} />
              <Text style={styles.actionButtonText}>Watch Video</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              task.completed ? buttonStyles.outline : buttonStyles.primary,
              styles.actionButton
            ]}
            onPress={handleToggleComplete}
          >
            <Icon 
              name={task.completed ? 'refresh' : 'checkmark'} 
              size={20} 
              color={task.completed ? colors.primary : colors.backgroundAlt} 
            />
            <Text style={[
              styles.actionButtonText,
              task.completed && { color: colors.primary }
            ]}>
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Notes (if completed) */}
        {task.completed && (
          <View style={styles.notesCard}>
            <Text style={styles.sectionTitle}>Progress Notes</Text>
            <Text style={styles.notesText}>
              Great job completing this task! Your progress is being tracked and will be reviewed in your next session.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  taskHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  taskIconContainer: {
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  taskTypeContainer: {
    backgroundColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  taskType: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  descriptionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  contentCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  contentText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  notesText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
