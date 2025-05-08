import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CameraModule } from '@/components/CameraModule';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CameraScreen() {
  const router = useRouter();
  const { lotId } = useLocalSearchParams<{ lotId: string }>();

  const handlePhotoTaken = (photoData: { uri: string; tag: string | null }) => {
    router.replace({
      pathname: '/lot/photo-review',
      params: { 
        photoUri: photoData.uri,
        tag: photoData.tag || '',
        lotId: lotId
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