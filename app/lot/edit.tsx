import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconButton, Dialog, Portal, Button, TextInput, Divider } from 'react-native-paper';
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
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadLot();
  }, [lotId]);

  const loadLot = async () => {
    try {
      const lotData = await azureService.getLotById(lotId);
      setLot(lotData);
      // Initialize form fields
      setTitle(lotData.title);
      setLotNumber(lotData.lotNumber);
      setTagNumber(lotData.tagNumber);
      setDescription(lotData.description || '');
      setCategory(lotData.category || '');
    } catch (err) {
      console.error('Error loading lot:', err);
      setError('Failed to load lot details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lot) return;

    try {
      setError(null);
      const updatedLot = await azureService.updateLot(lotId, {
        title,
        lotNumber,
        tagNumber,
        description,
      }, lot.category);
      setLot(updatedLot);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating lot:', err);
      setError('Failed to update lot. Please try again.');
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

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Basic Information</ThemedText>
          
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            disabled={!isEditing}
          />
          
          <TextInput
            label="Lot Number"
            value={lotNumber}
            onChangeText={setLotNumber}
            style={styles.input}
            disabled={!isEditing}
          />
          
          <TextInput
            label="Tag Number"
            value={tagNumber}
            onChangeText={setTagNumber}
            style={styles.input}
            disabled={!isEditing}
          />
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={3}
            disabled={!isEditing}
          />
          
          <TextInput
            label="Category"
            value={category}
            style={styles.input}
            disabled={true}
          />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Metadata</ThemedText>
          <ThemedText>Created: {new Date(lot.createdAt).toLocaleString()}</ThemedText>
          <ThemedText>Last Updated: {new Date(lot.updatedAt).toLocaleString()}</ThemedText>
          <ThemedText>Type: {lot.type}</ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <Button 
              mode="contained" 
              onPress={handleSave}
              style={styles.button}
            >
              Save Changes
            </Button>
          ) : (
            <Button 
              mode="contained" 
              onPress={() => setIsEditing(true)}
              style={styles.button}
            >
              Edit Information
            </Button>
          )}
          
          <Button 
            mode="contained" 
            onPress={() => router.push({
              pathname: '/lot/photos',
              params: { lotId: lotId }
            })}
            style={styles.button}
          >
            Edit Photos
          </Button>
        </View>
      </ScrollView>

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
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteButton: {
    margin: 0,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
}); 