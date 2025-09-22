
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { mockClients, mockTasks } from '../../data/mockData';
import { Client } from '../../types';
import ClientCard from '../../components/ClientCard';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function AdminClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddClientVisible, setIsAddClientVisible] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  useEffect(() => {
    setClients(mockClients);
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getClientTaskCount = (clientId: string) => {
    return mockTasks.filter(task => task.clientId === clientId).length;
  };

  const handleClientPress = (client: Client) => {
    router.push(`/client-detail/${client.id}`);
  };

  const handleAddClient = () => {
    if (!newClientName.trim() || !newClientEmail.trim()) {
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: newClientName.trim(),
      email: newClientEmail.trim(),
      role: 'client',
      createdAt: new Date().toISOString(),
      assignedTasks: [],
    };

    setClients(prev => [...prev, newClient]);
    setNewClientName('');
    setNewClientEmail('');
    setIsAddClientVisible(false);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Client Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddClientVisible(true)}
          >
            <Icon name="add" size={24} color={colors.backgroundAlt} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{clients.length}</Text>
            <Text style={styles.statLabel}>Total Clients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {mockTasks.filter(task => !task.completed).length}
            </Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {mockTasks.filter(task => task.completed).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <ScrollView style={styles.clientsList} showsVerticalScrollIndicator={false}>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                taskCount={getClientTaskCount(client.id)}
                onPress={() => handleClientPress(client)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={60} color={colors.textLight} />
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try a different search term' : 'Add your first client to get started'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <SimpleBottomSheet
        isVisible={isAddClientVisible}
        onClose={() => setIsAddClientVisible(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Add New Client</Text>
          
          <TextInput
            style={commonStyles.input}
            placeholder="Client Name"
            value={newClientName}
            onChangeText={setNewClientName}
            placeholderTextColor={colors.textLight}
          />
          
          <TextInput
            style={commonStyles.input}
            placeholder="Email Address"
            value={newClientEmail}
            onChangeText={setNewClientEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textLight}
          />
          
          <View style={styles.bottomSheetButtons}>
            <TouchableOpacity
              style={[buttonStyles.outline, styles.cancelButton]}
              onPress={() => setIsAddClientVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, styles.addClientButton]}
              onPress={handleAddClient}
            >
              <Text style={styles.addClientButtonText}>Add Client</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    boxShadow: `0px 1px 4px ${colors.shadow}`,
    elevation: 2,
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
  clientsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  bottomSheetButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  addClientButton: {
    flex: 1,
  },
  addClientButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
});
