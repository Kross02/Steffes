import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, IconButton } from 'react-native-paper';
import { azureService } from '@/services/azureService';
import { Lot } from '@/types/lot';
import { Image } from 'expo-image';

export default function PhotosScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const router = useRouter();
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLot();
  }, [lotId]);

  const loadLot = async () => {
    try {
      const lotData = await azureService.getLotById(lotId);
      setLot(lotData);
    } catch (err) {
      console.error('Error loading lot:', err);
      setError('Failed to load lot details');
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = () => {
    router.push({
      pathname: '/lot/camera',
      params: { lotId: lotId }
    });
  };

  const handlePhotoPress = (photo: any) => {
    // Navigate to photo detail view
    router.push({
      pathname: '/lot/photo-detail',
      params: { 
        lotId: lotId,
        photoId: photo.id
      }
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!lot) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Lot not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.header}>Photos</ThemedText>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
      </View>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}

      <FlatList
        data={lot.pictures || []}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.photoContainer}
            onPress={() => handlePhotoPress(item)}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.photo}
            />
            <ThemedText style={styles.photoTag}>{item.tag}</ThemedText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>No photos yet</ThemedText>
          </View>
        }
      />

      <Button
        mode="contained"
        onPress={handleTakePhoto}
        style={styles.takePhotoButton}
        icon="camera"
      >
        Take Photo
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    flex: 1,
    textAlign: 'center',
  },
  photoContainer: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 4,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoTag: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  takePhotoButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
}); 