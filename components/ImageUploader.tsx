
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface ImageUploaderProps {
  imageUrl?: string | null;
  onPress: () => void;
  loading?: boolean;
  type: 'logo' | 'avatar';
  size?: number;
}

export default function ImageUploader({ 
  imageUrl, 
  onPress, 
  loading = false, 
  type,
  size = 100 
}: ImageUploaderProps) {
  const isLogo = type === 'logo';
  const containerStyle = isLogo ? styles.logoContainer : styles.avatarContainer;
  const imageStyle = isLogo ? styles.logoImage : styles.avatarImage;

  return (
    <TouchableOpacity 
      style={[containerStyle, { width: size, height: isLogo ? size * 0.6 : size }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      ) : imageUrl ? (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={imageStyle} />
          <View style={styles.editOverlay}>
            <Icon name="camera-outline" size={20} color={colors.backgroundAlt} />
          </View>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Icon 
            name={isLogo ? "business-outline" : "person-outline"} 
            size={isLogo ? 32 : 40} 
            color={colors.textLight} 
          />
          <Text style={styles.placeholderText}>
            {isLogo ? 'Add Logo' : 'Add Photo'}
          </Text>
          <Text style={styles.placeholderSubtext}>
            Tap to upload
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarContainer: {
    backgroundColor: colors.card,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 4,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
});
