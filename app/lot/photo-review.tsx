import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

export default function PhotoReviewScreen() {
  const router = useRouter();
  const { photoUri, tag } = useLocalSearchParams<{ photoUri: string; tag: string }>();

  const handleSave = () => {
    // TODO: Save the photo to the lot's photos
    router.back();
  };

  const handleDiscard = () => {
    router.back();
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
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
}); 