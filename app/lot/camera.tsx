import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CameraModule } from '@/components/CameraModule';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const router = useRouter();

  const handlePhotoTaken = (photoData: any) => {
    router.push({
      pathname: '/lot/photo-review',
      params: { 
        photoData: JSON.stringify(photoData),
        lotId: lotId // Pass the lotId to the review screen
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