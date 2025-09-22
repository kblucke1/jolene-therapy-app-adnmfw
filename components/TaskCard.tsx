
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onToggleComplete }) => {
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

  return (
    <TouchableOpacity style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon 
            name={getTaskIcon(task.type)} 
            size={24} 
            color={getTaskTypeColor(task.type)} 
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.type}>{task.type.toUpperCase()}</Text>
        </View>
        {onToggleComplete && (
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={onToggleComplete}
          >
            <Icon 
              name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} 
              size={24} 
              color={task.completed ? colors.success : colors.textLight} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>
      
      <View style={styles.footer}>
        {task.duration && (
          <View style={styles.durationContainer}>
            <Icon name="time-outline" size={16} color={colors.textLight} />
            <Text style={styles.duration}>{task.duration} min</Text>
          </View>
        )}
        {task.dueDate && (
          <View style={styles.dueDateContainer}>
            <Icon name="calendar-outline" size={16} color={colors.textLight} />
            <Text style={styles.dueDate}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  checkboxContainer: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
});

export default TaskCard;
