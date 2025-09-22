
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../styles/commonStyles';
import { mockTasks, mockClients } from '../../data/mockData';
import { Task } from '../../types';
import Icon from '../../components/Icon';

const { width } = Dimensions.get('window');

export default function AdminAnalyticsScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setTasks(mockTasks);
    setClients(mockClients);
  }, []);

  // Calculate analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Tasks by type
  const tasksByType = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completedByType = tasks.filter(task => task.completed).reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Client engagement
  const clientEngagement = clients.map(client => {
    const clientTasks = tasks.filter(task => task.clientId === client.id);
    const clientCompleted = clientTasks.filter(task => task.completed).length;
    const clientRate = clientTasks.length > 0 ? (clientCompleted / clientTasks.length) * 100 : 0;
    
    return {
      name: client.name,
      totalTasks: clientTasks.length,
      completedTasks: clientCompleted,
      completionRate: clientRate,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  // Weekly progress (mock data)
  const weeklyData = [
    { week: 'Week 1', assigned: 8, completed: 5 },
    { week: 'Week 2', assigned: 12, completed: 9 },
    { week: 'Week 3', assigned: 6, completed: 4 },
    { week: 'Week 4', assigned: 10, completed: 7 },
  ];

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

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Analytics Dashboard</Text>

        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <Icon name="people-outline" size={32} color={colors.primary} />
            <Text style={styles.overviewNumber}>{clients.length}</Text>
            <Text style={styles.overviewLabel}>Active Clients</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <Icon name="list-outline" size={32} color={colors.secondary} />
            <Text style={styles.overviewNumber}>{totalTasks}</Text>
            <Text style={styles.overviewLabel}>Total Tasks</Text>
          </View>
          
          <View style={styles.overviewCard}>
            <Icon name="checkmark-circle-outline" size={32} color={colors.accent} />
            <Text style={styles.overviewNumber}>{Math.round(completionRate)}%</Text>
            <Text style={styles.overviewLabel}>Completion Rate</Text>
          </View>
        </View>

        {/* Task Types Analysis */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Task Types Performance</Text>
          {Object.entries(tasksByType).map(([type, count]) => {
            const completed = completedByType[type] || 0;
            const percentage = count > 0 ? (completed / count) * 100 : 0;
            
            return (
              <View key={type} style={styles.typeAnalysisCard}>
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

        {/* Client Engagement */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Client Engagement</Text>
          {clientEngagement.map((client, index) => (
            <View key={index} style={styles.clientEngagementCard}>
              <View style={styles.clientEngagementHeader}>
                <View style={styles.clientRank}>
                  <Text style={styles.rankNumber}>#{index + 1}</Text>
                </View>
                <View style={styles.clientEngagementInfo}>
                  <Text style={styles.clientEngagementName}>{client.name}</Text>
                  <Text style={styles.clientEngagementStats}>
                    {client.completedTasks} of {client.totalTasks} tasks completed
                  </Text>
                </View>
                <Text style={styles.clientEngagementRate}>
                  {Math.round(client.completionRate)}%
                </Text>
              </View>
              <View style={styles.clientProgressBar}>
                <View 
                  style={[
                    styles.clientProgressFill, 
                    { width: `${client.completionRate}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Trends */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Weekly Trends</Text>
          {weeklyData.map((week, index) => {
            const completionRate = week.assigned > 0 ? (week.completed / week.assigned) * 100 : 0;
            
            return (
              <View key={index} style={styles.weekTrendCard}>
                <View style={styles.weekTrendHeader}>
                  <Text style={styles.weekTrendName}>{week.week}</Text>
                  <View style={styles.weekTrendStats}>
                    <Text style={styles.weekTrendAssigned}>
                      {week.assigned} assigned
                    </Text>
                    <Text style={styles.weekTrendCompleted}>
                      {week.completed} completed
                    </Text>
                  </View>
                </View>
                <View style={styles.weekProgressBar}>
                  <View 
                    style={[
                      styles.weekProgressFill, 
                      { width: `${completionRate}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.weekCompletionRate}>
                  {Math.round(completionRate)}% completion rate
                </Text>
              </View>
            );
          })}
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={commonStyles.subtitle}>Key Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Icon name="trending-up-outline" size={24} color={colors.success} />
              <Text style={styles.insightText}>
                Exercise tasks have the highest completion rate at{' '}
                {Math.round(((completedByType.exercise || 0) / (tasksByType.exercise || 1)) * 100)}%
              </Text>
            </View>
            
            <View style={styles.insightCard}>
              <Icon name="people-outline" size={24} color={colors.primary} />
              <Text style={styles.insightText}>
                {clientEngagement[0]?.name || 'No clients'} is your most engaged client
              </Text>
            </View>
            
            <View style={styles.insightCard}>
              <Icon name="time-outline" size={24} color={colors.warning} />
              <Text style={styles.insightText}>
                {tasks.filter(task => !task.completed).length} tasks are still pending completion
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overviewContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  typeAnalysisCard: {
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
  clientEngagementCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  clientEngagementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.backgroundAlt,
  },
  clientEngagementInfo: {
    flex: 1,
  },
  clientEngagementName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  clientEngagementStats: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  clientEngagementRate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  clientProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  clientProgressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  weekTrendCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  weekTrendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekTrendName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekTrendStats: {
    alignItems: 'flex-end',
  },
  weekTrendAssigned: {
    fontSize: 12,
    color: colors.textLight,
  },
  weekTrendCompleted: {
    fontSize: 12,
    color: colors.success,
    marginTop: 2,
  },
  weekProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 8,
  },
  weekProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  weekCompletionRate: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});
