
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';

export default function MainScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.centerContent}>
        <Text style={commonStyles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role === 'admin') {
    return <Redirect href="/admin" />;
  }

  return <Redirect href="/client" />;
}
