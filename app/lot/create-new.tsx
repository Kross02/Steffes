import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Menu, IconButton } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { dbService } from '@/services/database';

export default function CreateNewLotScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEditPhotos = () => {
    closeMenu();
    // Dummy function for now
    console.log('Edit Photos clicked');
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!lotNumber.trim()) {
      setError('Lot number is required');
      return;
    }
    if (!tagNumber.trim()) {
      setError('Tag number is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the lot in the database
      const newLot = await dbService.createLot({
        title: title.trim(),
        lotNumber: lotNumber.trim(),
        tagNumber: tagNumber.trim(),
        description: description.trim(),
        status: 'draft',
        pictures: []
      });

      console.log('Lot created successfully:', newLot);
      
      // Navigate back to inventory screen
      router.back();
    } catch (err) {
      console.error('Error creating lot:', err);
      setError('Failed to create lot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.header}>Create Lot</ThemedText>
        
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item onPress={handleEditPhotos} title="Edit Photos" />
        </Menu>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        )}
        
        <View style={styles.formContainer}>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Lot Number"
            value={lotNumber}
            onChangeText={setLotNumber}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Tag Number"
            value={tagNumber}
            onChangeText={setTagNumber}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={() => router.back()} 
              style={styles.button}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button 
              mode="contained" 
              onPress={handleSubmit} 
              style={styles.button}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Lot
            </Button>
          </View>
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
  scrollContent: {
    padding: 16,
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 