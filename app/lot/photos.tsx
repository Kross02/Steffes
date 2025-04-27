import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

// Placeholder data for thumbnails
const placeholderPhotos = [
  { id: '1', uri: 'https://picsum.photos/200/200?random=1', tag: 'Front View' },
  { id: '2', uri: 'https://picsum.photos/200/200?random=2', tag: 'Side View' },
  { id: '3', uri: 'https://picsum.photos/200/200?random=3', tag: 'Back View' },
];

export default function PhotosScreen() {
  const router = useRouter();

  const handleTakePhoto = () => {
    router.push('/lot/camera');
  };

  const handleThumbnailPress = (photoId: string) => {
    router.push({
      pathname: '/lot/photo-detail',
      params: { photoId }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.header}>Photos</ThemedText>
      </View>

      <Button 
        mode="contained" 
        onPress={handleTakePhoto}
        style={styles.takePhotoButton}
      >
        Take Photo
      </Button>

      <ScrollView style={styles.thumbnailsContainer}>
        <View style={styles.thumbnailsGrid}>
          {placeholderPhotos.map((photo) => (
            <Pressable 
              key={photo.id}
              onPress={() => handleThumbnailPress(photo.id)}
              style={styles.thumbnailWrapper}
            >
              <Image
                source={{ uri: photo.uri }}
                style={styles.thumbnail}
                contentFit="cover"
              />
              <ThemedText style={styles.thumbnailTag}>{photo.tag}</ThemedText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  header: {
    flex: 1,
  },
  takePhotoButton: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  thumbnailsContainer: {
    flex: 1,
  },
  thumbnailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  thumbnailWrapper: {
    width: '33.33%',
    padding: 5,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  thumbnailTag: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
}); 