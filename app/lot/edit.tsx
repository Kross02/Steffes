import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconButton, Dialog, Portal, Button } from 'react-native-paper';
import { azureService } from '@/services/azureService';
import { Lot } from '@/types/lot';

export default function EditLotScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const router = useRouter();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);

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

  const showDeleteDialog = () => setDeleteDialogVisible(true);
  const hideDeleteDialog = () => setDeleteDialogVisible(false);

  const handleDelete = async () => {
    if (!lot) {
      setError('Lot data not available');
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await azureService.deleteLot(lotId, lot.category);
      hideDeleteDialog();
      router.back(); // Return to inventory screen after successful deletion
    } catch (err) {
      console.error('Error deleting lot:', err);
      setError('Failed to delete lot. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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
        <ThemedText type="title" style={styles.header}>Edit Lot</ThemedText>
        <IconButton
          icon="delete"
          size={24}
          onPress={showDeleteDialog}
          style={styles.deleteButton}
        />
      </View>

      <ThemedText>Lot ID: {lotId}</ThemedText>
      <ThemedText>Category: {lot.category}</ThemedText>
      <ThemedText>This screen will be implemented later.</ThemedText>

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Delete Lot</Dialog.Title>
          <Dialog.Content>
            <ThemedText>Are you sure you want to delete this lot? This action cannot be undone.</ThemedText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>Cancel</Button>
            <Button 
              onPress={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  deleteButton: {
    margin: 0,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
}); 