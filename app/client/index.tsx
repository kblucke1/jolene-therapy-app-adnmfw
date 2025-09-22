
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { mockTasks } from '../../data/mockData';
import { Task } from '../../types';
import TaskCard from '../../components/TaskCard';
import Icon from '../../components/Icon';

export default function ClientTasksScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    // In a real app, this would fetch tasks for the current user
    setTasks(mockTasks.filter(task => task.clientId === '1')); // Mock client ID
  }, []);

  const handleTaskPress = (task: Task) => {
    router.push(`/task/${task.id}`);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Welcome back!</Text>
          <Text style={commonStyles.text}>
            You have {tasks.filter(t => !t.completed).length} pending tasks
          </Text>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {completedCount} of {totalCount} tasks completed
          </Text>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'pending', 'completed'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterButton,
                filter === filterOption && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[
                styles.filterButtonText,
                filter === filterOption && styles.filterButtonTextActive
              ]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task)}
                onToggleComplete={() => handleToggleComplete(task.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="checkmark-circle-outline" size={60} color={colors.textLight} />
              <Text style={styles.emptyStateText}>
                {filter === 'completed' 
                  ? 'No completed tasks yet' 
                  : filter === 'pending'
                  ? 'No pending tasks'
                  : 'No tasks assigned yet'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  filterButtonTextActive: {
    color: colors.backgroundAlt,
  },
  tasksList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});
