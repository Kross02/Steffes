import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { dbService } from '@/services/database';

export default function CreateLotScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
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
      // Create the lot in the database
      const newLot = await dbService.createLot({
        title: title.trim(),
        lotNumber: lotNumber.trim(),
        tagNumber: tagNumber.trim(),
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Create New Lot</ThemedText>
        
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
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
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