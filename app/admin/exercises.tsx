
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import SimpleBottomSheet from '../../components/BottomSheet';
import { Exercise } from '../../types';
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
  exerciseCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  exerciseTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  instructionItem: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    marginBottom: 2,
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: colors.primary + '20',
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
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
  instructionsContainer: {
    marginBottom: 16,
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addInstructionButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  removeInstructionButton: {
    backgroundColor: colors.error + '20',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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

export default function AdminExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    instructions: [''],
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      Alert.alert('Error', 'Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setEditingExercise(null);
    setFormData({
      title: '',
      description: '',
      estimatedTime: '',
      instructions: [''],
    });
    setShowBottomSheet(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      title: exercise.title,
      description: exercise.description || '',
      estimatedTime: exercise.estimatedTime.toString(),
      instructions: exercise.instructions.length > 0 ? exercise.instructions : [''],
    });
    setShowBottomSheet(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('exercises')
                .delete()
                .eq('id', exerciseId);

              if (error) throw error;
              
              setExercises(exercises.filter(e => e.id !== exerciseId));
              Alert.alert('Success', 'Exercise deleted successfully');
            } catch (error) {
              console.error('Error deleting exercise:', error);
              Alert.alert('Error', 'Failed to delete exercise');
            }
          },
        },
      ]
    );
  };

  const handleSaveExercise = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const validInstructions = formData.instructions.filter(inst => inst.trim() !== '');
    if (validInstructions.length === 0) {
      Alert.alert('Error', 'Please add at least one instruction');
      return;
    }

    try {
      const exerciseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        estimated_time: parseInt(formData.estimatedTime) || 0,
        instructions: validInstructions,
      };

      if (editingExercise) {
        const { error } = await supabase
          .from('exercises')
          .update(exerciseData)
          .eq('id', editingExercise.id);

        if (error) throw error;
        
        Alert.alert('Success', 'Exercise updated successfully');
      } else {
        const { error } = await supabase
          .from('exercises')
          .insert([exerciseData]);

        if (error) throw error;
        
        Alert.alert('Success', 'Exercise added successfully');
      }

      setShowBottomSheet(false);
      fetchExercises();
    } catch (error) {
      console.error('Error saving exercise:', error);
      Alert.alert('Error', 'Failed to save exercise');
    }
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      instructions: newInstructions.length > 0 ? newInstructions : [''],
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({
      ...formData,
      instructions: newInstructions,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyStateText}>Loading exercises...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Physical Exercises</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
          <Icon name="plus" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="activity" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No exercises yet.{'\n'}Tap the + button to add your first exercise.
            </Text>
          </View>
        ) : (
          exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              {exercise.description && (
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              )}
              <Text style={styles.exerciseTime}>Estimated time: {exercise.estimatedTime} minutes</Text>
              
              {exercise.instructions.length > 0 && (
                <>
                  <Text style={styles.instructionsLabel}>Instructions:</Text>
                  {exercise.instructions.map((instruction, index) => (
                    <Text key={index} style={styles.instructionItem}>
                      {index + 1}. {instruction}
                    </Text>
                  ))}
                </>
              )}
              
              <View style={styles.exerciseActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditExercise(exercise)}
                >
                  <Icon name="edit" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteExercise(exercise.id)}
                >
                  <Icon name="trash" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>
            {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Exercise Title *"
            placeholderTextColor={colors.textSecondary}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor={colors.textSecondary}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Estimated Time (minutes)"
            placeholderTextColor={colors.textSecondary}
            value={formData.estimatedTime}
            onChangeText={(text) => setFormData({ ...formData, estimatedTime: text })}
            keyboardType="numeric"
          />

          <View style={styles.instructionsContainer}>
            <View style={styles.instructionsHeader}>
              <Text style={styles.instructionsTitle}>Instructions</Text>
              <TouchableOpacity style={styles.addInstructionButton} onPress={addInstruction}>
                <Icon name="plus" size={16} color={colors.surface} />
              </TouchableOpacity>
            </View>

            {formData.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <TextInput
                  style={styles.instructionInput}
                  placeholder={`Step ${index + 1}`}
                  placeholderTextColor={colors.textSecondary}
                  value={instruction}
                  onChangeText={(text) => updateInstruction(index, text)}
                />
                {formData.instructions.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeInstructionButton}
                    onPress={() => removeInstruction(index)}
                  >
                    <Icon name="minus" size={16} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBottomSheet(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExercise}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {editingExercise ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
