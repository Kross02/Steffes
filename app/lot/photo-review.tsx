import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { azureService } from '@/services/azureService';

export default function PhotoReviewScreen() {
  const router = useRouter();
  const { photoUri, tag, lotId } = useLocalSearchParams<{ photoUri: string; tag: string; lotId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [lot, setLot] = useState<any>(null);

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
    }
  };

  const handleSave = async () => {
    try {
      // Upload photo to blob storage
      const photoUrl = await azureService.uploadPhoto(photoUri);
      
      // Add photo to lot
      await azureService.updateLot(lotId, {
        pictures: [...(lot?.pictures || []), {
          id: Date.now().toString(),
          url: photoUrl,
          tag: tag || 'New Photo',
          timestamp: new Date().toISOString()
        }]
      }, lot?.category);

      // Return to photos screen
      router.replace({
        pathname: '/lot/photos',
        params: { lotId: lotId }
      });
    } catch (err) {
      console.error('Error saving photo:', err);
      setError('Failed to save photo');
    }
  };

  const handleDiscard = () => {
    router.replace({
        pathname: '/lot/camera',
        params: { lotId: lotId }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.header}>Review Photo</ThemedText>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: photoUri }}
          style={styles.preview}
          contentFit="contain"
        />
        
        {tag && (
          <ThemedText style={styles.tag}>Tag: {tag}</ThemedText>
        )}

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleDiscard}
            style={styles.button}
          >
            Discard
          </Button>
          
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.button}
          >
            Save
          </Button>
        </View>
      </View>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  preview: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  tag: {
    marginTop: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    minWidth: 120,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
}); 