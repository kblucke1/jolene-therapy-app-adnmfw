
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/Icon';

export default function ClientProfileScreen() {
  const { user, logout } = useAuth();

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

  const profileSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Personal Information', onPress: () => console.log('Personal Info') },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => console.log('Notifications') },
        { icon: 'lock-closed-outline', label: 'Privacy & Security', onPress: () => console.log('Privacy') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help & FAQ', onPress: () => console.log('Help') },
        { icon: 'mail-outline', label: 'Contact Therapist', onPress: () => console.log('Contact') },
        { icon: 'document-text-outline', label: 'Terms & Conditions', onPress: () => console.log('Terms') },
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

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={commonStyles.title}>Profile</Text>
        
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Icon name="person-circle" size={80} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Client Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'client@email.com'}</Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>67%</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
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
            Jolene Dawn Counselling & Consulting
          </Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userCard: {
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
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  userStats: {
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
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
