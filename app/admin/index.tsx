
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';
import ClientCard from '../../components/ClientCard';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import SimpleBottomSheet from '../../components/BottomSheet';
import { Client, Task } from '../../types';
import { supabase } from '../integrations/supabase/client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.border,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButtonText: {
    color: colors.surface,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default function AdminClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    therapistNotes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsResult, tasksResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*'),
      ]);

      if (clientsResult.error) throw clientsResult.error;
      if (tasksResult.error) throw tasksResult.error;

      setClients(clientsResult.data || []);
      setTasks(tasksResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getClientTaskCount = (clientId: string) => {
    const clientTasks = tasks.filter(task => task.clientId === clientId);
    const completed = clientTasks.filter(task => task.completed).length;
    const total = clientTasks.length;
    return { completed, total, pending: total - completed };
  };

  const handleClientPress = (client: Client) => {
    router.push(`/client/${client.id}`);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      therapistNotes: '',
    });
    setShowBottomSheet(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      therapistNotes: client.therapistNotes || '',
    });
    setShowBottomSheet(true);
  };

  const handleSaveClient = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const clientData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: 'client' as const,
        therapist_notes: formData.therapistNotes.trim(),
      };

      if (editingClient) {
        const { error } = await supabase
          .from('profiles')
          .update(clientData)
          .eq('id', editingClient.id);

        if (error) throw error;
        
        Alert.alert('Success', 'Client updated successfully');
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert([clientData]);

        if (error) throw error;
        
        Alert.alert('Success', 'Client added successfully');
      }

      setShowBottomSheet(false);
      fetchData();
    } catch (error) {
      console.error('Error saving client:', error);
      Alert.alert('Error', 'Failed to save client');
    }
  };

  const handleDeleteClient = (clientId: string) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client? This will also delete all their tasks.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', clientId);

              if (error) throw error;
              
              setClients(clients.filter(c => c.id !== clientId));
              setTasks(tasks.filter(t => t.clientId !== clientId));
              Alert.alert('Success', 'Client deleted successfully');
            } catch (error) {
              console.error('Error deleting client:', error);
              Alert.alert('Error', 'Failed to delete client');
            }
          },
        },
      ]
    );
  };

  const getFilteredClients = () => {
    if (!searchQuery.trim()) return clients;
    
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getOverallStats = () => {
    const totalClients = clients.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeClients = clients.filter(client => {
      const clientTasks = tasks.filter(task => task.clientId === client.id);
      return clientTasks.some(task => !task.completed);
    }).length;

    return { totalClients, totalTasks, completedTasks, activeClients };
  };

  const stats = getOverallStats();
  const filteredClients = getFilteredClients();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyStateText}>Loading clients...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Client Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
          <Icon name="plus" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalClients}</Text>
          <Text style={styles.statLabel}>Total Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{stats.activeClients}</Text>
          <Text style={styles.statLabel}>Active Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.totalTasks}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.info }]}>{stats.completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="users" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              {searchQuery.trim() 
                ? 'No clients found matching your search.'
                : 'No clients yet.\nTap the + button to add your first client.'
              }
            </Text>
          </View>
        ) : (
          filteredClients.map((client) => {
            const taskStats = getClientTaskCount(client.id);
            return (
              <ClientCard
                key={client.id}
                client={client}
                taskStats={taskStats}
                onPress={() => handleClientPress(client)}
                onEdit={() => handleEditClient(client)}
                onDelete={() => handleDeleteClient(client.id)}
              />
            );
          })
        )}
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor={colors.textSecondary}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address *"
            placeholderTextColor={colors.textSecondary}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Therapist Notes"
            placeholderTextColor={colors.textSecondary}
            value={formData.therapistNotes}
            onChangeText={(text) => setFormData({ ...formData, therapistNotes: text })}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBottomSheet(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveClient}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {editingClient ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
