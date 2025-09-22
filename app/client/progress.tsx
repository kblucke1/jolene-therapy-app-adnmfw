
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import { mockTasks } from '../../data/mockData';
import { Task } from '../../types';
import Icon from '../../components/Icon';

const { width } = Dimensions.get('window');

export default function ClientProgressScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // In a real app, this would fetch tasks for the current user
    setTasks(mockTasks.filter(task => task.clientId === '1')); // Mock client ID
  }, []);

  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  // Calculate stats by task type
  const tasksByType = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completedByType = completedTasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle-outline';
      case 'exercise': return 'fitness-outline';
      case 'reading': return 'book-outline';
      case 'reflection': return 'journal-outline';
      default: return 'document-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return colors.danger;
      case 'exercise': return colors.accent;
      case 'reading': return colors.primary;
      case 'reflection': return colors.secondary;
      default: return colors.textLight;
    }
  };

  // Calculate weekly progress (mock data)
  const weeklyProgress = [
    { week: 'Week 1', completed: 2, total: 3 },
    { week: 'Week 2', completed: 3, total: 4 },
    { week: 'Week 3', completed: 1, total: 2 },
    { week: 'Week 4', completed: 2, total: 3 },
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Your Progress</Text>
        
        {/* Overall Progress Circle */}
        <View style={styles.overallProgressCard}>
          <View style={styles.progressCircleContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{Math.round(completionRate)}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedTasks.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalTasks - completedTasks.length}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Task Types Breakdown */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Task Types</Text>
          {Object.entries(tasksByType).map(([type, count]) => {
            const completed = completedByType[type] || 0;
            const percentage = count > 0 ? (completed / count) * 100 : 0;
            
            return (
              <View key={type} style={styles.typeCard}>
                <View style={styles.typeHeader}>
                  <View style={styles.typeIconContainer}>
                    <Icon 
                      name={getTypeIcon(type)} 
                      size={24} 
                      color={getTypeColor(type)} 
                    />
                  </View>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeName}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    <Text style={styles.typeStats}>
                      {completed} of {count} completed
                    </Text>
                  </View>
                  <Text style={styles.typePercentage}>
                    {Math.round(percentage)}%
                  </Text>
                </View>
                <View style={styles.typeProgressBar}>
                  <View 
                    style={[
                      styles.typeProgressFill, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: getTypeColor(type)
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Weekly Progress</Text>
          {weeklyProgress.map((week, index) => {
            const percentage = week.total > 0 ? (week.completed / week.total) * 100 : 0;
            
            return (
              <View key={index} style={styles.weekCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekName}>{week.week}</Text>
                  <Text style={styles.weekStats}>
                    {week.completed}/{week.total}
                  </Text>
                </View>
                <View style={styles.weekProgressBar}>
                  <View 
                    style={[
                      styles.weekProgressFill, 
                      { width: `${percentage}%` }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={[styles.achievementCard, completedTasks.length >= 1 && styles.achievementUnlocked]}>
              <Icon 
                name="trophy-outline" 
                size={32} 
                color={completedTasks.length >= 1 ? colors.warning : colors.textLight} 
              />
              <Text style={styles.achievementTitle}>First Step</Text>
              <Text style={styles.achievementDesc}>Complete your first task</Text>
            </View>
            
            <View style={[styles.achievementCard, completedTasks.length >= 5 && styles.achievementUnlocked]}>
              <Icon 
                name="star-outline" 
                size={32} 
                color={completedTasks.length >= 5 ? colors.warning : colors.textLight} 
              />
              <Text style={styles.achievementTitle}>Consistent</Text>
              <Text style={styles.achievementDesc}>Complete 5 tasks</Text>
            </View>
            
            <View style={[styles.achievementCard, completionRate >= 50 && styles.achievementUnlocked]}>
              <Icon 
                name="medal-outline" 
                size={32} 
                color={completionRate >= 50 ? colors.warning : colors.textLight} 
              />
              <Text style={styles.achievementTitle}>Halfway There</Text>
              <Text style={styles.achievementDesc}>50% completion rate</Text>
            </View>
            
            <View style={[styles.achievementCard, completionRate >= 100 && styles.achievementUnlocked]}>
              <Icon 
                name="ribbon-outline" 
                size={32} 
                color={completionRate >= 100 ? colors.warning : colors.textLight} 
              />
              <Text style={styles.achievementTitle}>Perfect Score</Text>
              <Text style={styles.achievementDesc}>100% completion</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallProgressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  },
  section: {
    marginBottom: 24,
  },
  typeCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIconContainer: {
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  typeStats: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  typePercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  typeProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  typeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  weekCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekStats: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  weekProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  weekProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: (width - 60) / 2,
    alignItems: 'center',
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});
