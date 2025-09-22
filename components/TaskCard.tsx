
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import Icon from './Icon';
import React from 'react';
import { colors, commonStyles } from '../styles/commonStyles';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete?: () => void;
  onDelete?: () => void;
  showClient?: boolean;
  clientName?: string;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskType: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  clientInfo: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completeButtonCompleted: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    fontSize: 12,
    color: colors.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  completeButtonTextCompleted: {
    color: colors.surface,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.warning + '20',
  },
  statusText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: '600',
    marginLeft: 4,
  },
  overdueBadge: {
    backgroundColor: colors.error + '20',
  },
  overdueText: {
    color: colors.error,
  },
  completedBadge: {
    backgroundColor: colors.success + '20',
  },
  completedText: {
    color: colors.success,
  },
});

export default function TaskCard({ 
  task, 
  onPress, 
  onToggleComplete, 
  onDelete, 
  showClient = false, 
  clientName 
}: TaskCardProps) {
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
        return 'Video';
      case 'exercise':
        return 'Exercise';
      case 'reading':
        return 'Reading';
      case 'reflection':
        return 'Reflection';
      case 'photo_submission':
        return 'Photo Task';
      case 'document':
        return 'Document';
      default:
        return 'Task';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.completed;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (task.completed) {
      return (
        <View style={[styles.statusBadge, styles.completedBadge]}>
          <Icon name="check" size={10} color={colors.success} />
          <Text style={[styles.statusText, styles.completedText]}>Completed</Text>
        </View>
      );
    }
    
    if (isOverdue()) {
      return (
        <View style={[styles.statusBadge, styles.overdueBadge]}>
          <Icon name="alert-circle" size={10} color={colors.error} />
          <Text style={[styles.statusText, styles.overdueText]}>Overdue</Text>
        </View>
      );
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        return (
          <View style={styles.statusBadge}>
            <Icon name="clock" size={10} color={colors.warning} />
            <Text style={styles.statusText}>Due Soon</Text>
          </View>
        );
      }
    }

    return null;
  };

  return (
    <TouchableOpacity 
      style={[styles.card, task.completed && styles.completedTask]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.taskIcon}>
          <Icon 
            name={getTaskIcon(task.type)} 
            size={24} 
            color={getTaskTypeColor(task.type)} 
          />
        </View>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text 
          style={[
            styles.taskType, 
            { backgroundColor: getTaskTypeColor(task.type) }
          ]}
        >
          {getTaskTypeLabel(task.type)}
        </Text>
      </View>

      {showClient && clientName && (
        <Text style={styles.clientInfo}>Client: {clientName}</Text>
      )}

      {task.description && (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>
      )}

      <View style={styles.taskMeta}>
        {task.duration && (
          <View style={styles.metaItem}>
            <Icon name="clock" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>{task.duration} min</Text>
          </View>
        )}
        
        {task.dueDate && (
          <View style={styles.metaItem}>
            <Icon name="calendar" size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>Due {formatDate(task.dueDate)}</Text>
          </View>
        )}

        <View style={styles.metaItem}>
          <Icon name="calendar" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            Assigned {formatDate(task.assignedDate)}
          </Text>
        </View>
      </View>

      <View style={styles.taskActions}>
        <View style={styles.leftActions}>
          {onToggleComplete && (
            <TouchableOpacity
              style={[
                styles.completeButton,
                task.completed && styles.completeButtonCompleted,
              ]}
              onPress={onToggleComplete}
            >
              <Icon
                name={task.completed ? "check" : "circle"}
                size={12}
                color={task.completed ? colors.surface : colors.success}
              />
              <Text
                style={[
                  styles.completeButtonText,
                  task.completed && styles.completeButtonTextCompleted,
                ]}
              >
                {task.completed ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightActions}>
          {getStatusBadge()}
          
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Icon name="trash" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
