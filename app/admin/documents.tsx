
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import SimpleBottomSheet from '../../components/BottomSheet';
import { Document } from '../../types';
import { supabase } from '../integrations/supabase/client';
import * as DocumentPicker from 'expo-document-picker';

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
  documentCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentIcon: {
    marginRight: 12,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  documentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  documentSize: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
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
  downloadButton: {
    backgroundColor: colors.success + '20',
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
  filePickerButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  filePickerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  selectedFile: {
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedFileName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  selectedFileSize: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
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

export default function AdminDocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Error', 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = () => {
    setEditingDocument(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
    });
    setShowBottomSheet(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setSelectedFile(null);
    setFormData({
      title: document.title,
      description: document.description || '',
    });
    setShowBottomSheet(true);
  };

  const handleDeleteDocument = (documentId: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', documentId);

              if (error) throw error;
              
              setDocuments(documents.filter(d => d.id !== documentId));
              Alert.alert('Success', 'Document deleted successfully');
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert('Error', 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadDocument = async (file: any) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Create form data for upload
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      } as any);

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, formData);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      return { url: publicUrl, size: file.size };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleSaveDocument = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!editingDocument && !selectedFile) {
      Alert.alert('Error', 'Please select a PDF file');
      return;
    }

    try {
      let fileUrl = editingDocument?.fileUrl;
      let fileSize = editingDocument?.fileSize;

      if (selectedFile) {
        const uploadResult = await uploadDocument(selectedFile);
        fileUrl = uploadResult.url;
        fileSize = uploadResult.size;
      }

      const documentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        file_url: fileUrl,
        file_size: fileSize,
      };

      if (editingDocument) {
        const { error } = await supabase
          .from('documents')
          .update(documentData)
          .eq('id', editingDocument.id);

        if (error) throw error;
        
        Alert.alert('Success', 'Document updated successfully');
      } else {
        const { error } = await supabase
          .from('documents')
          .insert([documentData]);

        if (error) throw error;
        
        Alert.alert('Success', 'Document added successfully');
      }

      setShowBottomSheet(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
      Alert.alert('Error', 'Failed to save document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.emptyStateText}>Loading documents...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
          <Icon name="plus" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {documents.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="file-text" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No documents yet.{'\n'}Tap the + button to add your first document.
            </Text>
          </View>
        ) : (
          documents.map((document) => (
            <View key={document.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentIcon}>
                  <Icon name="file-text" size={24} color={colors.primary} />
                </View>
                <Text style={styles.documentTitle}>{document.title}</Text>
              </View>
              
              {document.description && (
                <Text style={styles.documentDescription}>{document.description}</Text>
              )}
              
              <Text style={styles.documentSize}>
                Size: {formatFileSize(document.fileSize)}
              </Text>
              
              <View style={styles.documentActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.downloadButton]}
                  onPress={() => {
                    // Open document URL
                    console.log('Opening document:', document.fileUrl);
                  }}
                >
                  <Icon name="download" size={16} color={colors.success} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditDocument(document)}
                >
                  <Icon name="edit" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteDocument(document.id)}
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
            {editingDocument ? 'Edit Document' : 'Add New Document'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Document Title *"
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

          {!editingDocument && (
            <TouchableOpacity style={styles.filePickerButton} onPress={pickDocument}>
              <Text style={styles.filePickerText}>
                {selectedFile ? 'Change PDF File' : 'Select PDF File *'}
              </Text>
            </TouchableOpacity>
          )}

          {selectedFile && (
            <View style={styles.selectedFile}>
              <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
              <Text style={styles.selectedFileSize}>
                {formatFileSize(selectedFile.size)}
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBottomSheet(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveDocument}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {editingDocument ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
