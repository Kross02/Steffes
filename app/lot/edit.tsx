import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';

export default function EditLotScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Edit Lot</ThemedText>
      <ThemedText>Lot ID: {lotId}</ThemedText>
      <ThemedText>This screen will be implemented later.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
}); 