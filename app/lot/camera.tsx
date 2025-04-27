import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CameraModule } from '@/components/CameraModule';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const router = useRouter();

  const handlePhotoTaken = (photoUri: string, tag: string | null) => {
    // Navigate to the review screen with the photo data
    router.push({
      pathname: '/lot/photo-review',
      params: { 
        photoUri,
        tag: tag || ''
      }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <CameraModule onPhotoTaken={handlePhotoTaken} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 