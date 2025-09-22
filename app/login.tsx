
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, role);
    
    if (result.success) {
      if (role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/client');
      }
    } else {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }
    setIsLoading(false);
  };

  const handleDemoLogin = (demoRole: 'client' | 'admin') => {
    const demoCredentials = {
      client: { email: 'client@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'admin123' }
    };
    
    setEmail(demoCredentials[demoRole].email);
    setPassword(demoCredentials[demoRole].password);
    setRole(demoRole);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.centerContent}>
        <View style={styles.logoContainer}>
          <Icon name="heart-outline" size={60} color={colors.primary} />
          <Text style={commonStyles.title}>Jolene Dawn</Text>
          <Text style={styles.subtitle}>Counselling & Consulting</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'client' && styles.roleButtonActive
              ]}
              onPress={() => setRole('client')}
            >
              <Text style={[
                styles.roleButtonText,
                role === 'client' && styles.roleButtonTextActive
              ]}>
                Client
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'admin' && styles.roleButtonActive
              ]}
              onPress={() => setRole('admin')}
            >
              <Text style={[
                styles.roleButtonText,
                role === 'admin' && styles.roleButtonTextActive
              ]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={commonStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textLight}
          />

          <TextInput
            style={commonStyles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textLight}
          />

          <TouchableOpacity
            style={[buttonStyles.primary, styles.loginButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <Text style={styles.demoLabel}>Quick Demo Access:</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity
                style={[buttonStyles.outline, styles.demoButton]}
                onPress={() => handleDemoLogin('client')}
              >
                <Text style={styles.demoButtonText}>Demo Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.outline, styles.demoButton]}
                onPress={() => handleDemoLogin('admin')}
              >
                <Text style={styles.demoButtonText}>Demo Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  roleButtonTextActive: {
    color: colors.backgroundAlt,
  },
  loginButton: {
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  demoContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  demoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
