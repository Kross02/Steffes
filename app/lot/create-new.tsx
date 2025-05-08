import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { azureService } from '@/services/azureService';

export default function CreateNewLotScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Create the lot using Azure service
      const newLot = await azureService.createLot({
        title: title.trim(),
        lotNumber: lotNumber.trim(),
        tagNumber: tagNumber.trim(),
        category: category.trim(),
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
            label="Category"
            value={category}
            onChangeText={setCategory}
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
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            Create Lot
          </Button>
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
    flexGrow: 1,
  },
  formContainer: {
    padding: 10,
  },
  input: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
}); 