
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import Icon from '../../components/Icon';
import ImageUploader from '../../components/ImageUploader';

export default function AdminProfileScreen() {
  const { user, logout } = useAuth();
  const { profile, loading, uploading, pickImage } = useProfile();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleLogoUpload = () => {
    console.log('Logo upload button pressed');
    pickImage('logo');
  };

  const handleAvatarUpload = () => {
    console.log('Avatar upload button pressed');
    pickImage('avatar');
  };

  const profileSections = [
    {
      title: 'Practice Management',
      items: [
        { icon: 'business-outline', label: 'Practice Settings', onPress: () => console.log('Practice Settings') },
        { icon: 'people-outline', label: 'Client Management', onPress: () => router.push('/admin') },
        { icon: 'clipboard-outline', label: 'Task Management', onPress: () => router.push('/admin/tasks') },
        { icon: 'analytics-outline', label: 'Reports & Analytics', onPress: () => router.push('/admin/analytics') },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { icon: 'play-circle-outline', label: 'Meditation Videos', onPress: () => router.push('/admin/videos') },
        { icon: 'fitness-outline', label: 'Physical Exercises', onPress: () => router.push('/admin/exercises') },
        { icon: 'document-text-outline', label: 'Documents & PDFs', onPress: () => router.push('/admin/documents') },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Personal Information', onPress: () => console.log('Personal Info') },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => console.log('Notifications') },
        { icon: 'lock-closed-outline', label: 'Security Settings', onPress: () => console.log('Security') },
        { icon: 'card-outline', label: 'Billing & Subscription', onPress: () => console.log('Billing') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help & Documentation', onPress: () => console.log('Help') },
        { icon: 'mail-outline', label: 'Contact Support', onPress: () => console.log('Support') },
        { icon: 'school-outline', label: 'Training Resources', onPress: () => console.log('Training') },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: 'information-circle-outline', label: 'About', onPress: () => console.log('About') },
        { icon: 'star-outline', label: 'Rate App', onPress: () => console.log('Rate') },
        { icon: 'log-out-outline', label: 'Sign Out', onPress: handleLogout, danger: true },
      ]
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Admin Profile</Text>
        
        {/* Practice Logo Section - Made more prominent */}
        <View style={styles.logoSection}>
          <View style={styles.logoHeader}>
            <Icon name="business-outline" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Practice Logo</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Upload your practice logo to personalize the app for your clients. This will appear throughout the client experience.
          </Text>
          <View style={styles.logoUploadContainer}>
            <ImageUploader
              imageUrl={profile?.logo_url}
              onPress={handleLogoUpload}
              loading={uploading}
              type="logo"
              size={240}
            />
            {!profile?.logo_url && !uploading && (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleLogoUpload}
              >
                <Icon name="cloud-upload-outline" size={20} color={colors.backgroundAlt} />
                <Text style={styles.uploadButtonText}>Upload Logo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Admin Info Card */}
        <View style={styles.adminCard}>
          <View style={styles.avatarContainer}>
            <ImageUploader
              imageUrl={profile?.avatar_url}
              onPress={handleAvatarUpload}
              loading={uploading}
              type="avatar"
              size={80}
            />
          </View>
          <Text style={styles.adminName}>
            {profile?.name || user?.user_metadata?.name || 'Dr. Jolene Dawn'}
          </Text>
          <Text style={styles.adminTitle}>Licensed Counselor</Text>
          <Text style={styles.adminEmail}>
            {profile?.email || user?.email || 'admin@jolenedawn.com'}
          </Text>
          
          <View style={styles.adminStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Active Clients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Tasks Assigned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin')}
            >
              <Icon name="person-add-outline" size={32} color={colors.primary} />
              <Text style={styles.quickActionText}>Add Client</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin/tasks')}
            >
              <Icon name="clipboard-outline" size={32} color={colors.secondary} />
              <Text style={styles.quickActionText}>Assign Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/admin/analytics')}
            >
              <Icon name="bar-chart-outline" size={32} color={colors.accent} />
              <Text style={styles.quickActionText}>View Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Icon name="settings-outline" size={32} color={colors.textLight} />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <Icon 
                      name={item.icon} 
                      size={24} 
                      color={item.danger ? colors.danger : colors.textLight} 
                    />
                    <Text style={[
                      styles.menuItemText,
                      item.danger && styles.menuItemTextDanger
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  <Icon 
                    name="chevron-forward-outline" 
                    size={20} 
                    color={colors.textLight} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            {profile?.practice_name || 'Jolene Dawn Counselling & Consulting'}
          </Text>
          <Text style={styles.appInfoText}>
            Admin Portal
          </Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoUploadContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  uploadButtonText: {
    color: colors.backgroundAlt,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  adminCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  adminName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  adminStats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  menuItemTextDanger: {
    color: colors.danger,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textLight,
  },
});
