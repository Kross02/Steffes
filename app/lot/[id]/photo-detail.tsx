import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

export default function PhotoDetailScreen() {
  const { id, photoId } = useLocalSearchParams<{ id: string; photoId: string }>();

  // TODO: Fetch the actual photo data using lot id and photoId
  const photo = {
    uri: 'https://picsum.photos/800/800?random=' + photoId,
    tag: 'Sample Tag'
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.header}>Photo Detail</ThemedText>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.photo}
          contentFit="contain"
        />
        
        <ThemedText style={styles.tag}>Tag: {photo.tag}</ThemedText>
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
  photo: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  tag: {
    marginTop: 20,
    fontSize: 16,
  },
}); 