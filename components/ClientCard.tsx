
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Client } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
  taskCount?: number;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onPress, taskCount = 0 }) => {
  return (
    <TouchableOpacity style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person-circle-outline" size={40} color={colors.primary} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{client.name}</Text>
          <Text style={styles.email}>{client.email}</Text>
          <Text style={styles.joinDate}>
            Joined: {new Date(client.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.taskBadge}>
            <Text style={styles.taskCount}>{taskCount}</Text>
            <Text style={styles.taskLabel}>Tasks</Text>
          </View>
        </View>
      </View>
      
      {client.therapistNotes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes} numberOfLines={2}>
            {client.therapistNotes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  statsContainer: {
    alignItems: 'center',
  },
  taskBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 50,
  },
  taskCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.backgroundAlt,
  },
  taskLabel: {
    fontSize: 10,
    color: colors.backgroundAlt,
    marginTop: 2,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default ClientCard;
