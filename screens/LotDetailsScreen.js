import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const LotDetailsScreen = ({ route, navigation }) => {
  const { lotNumber, lotName, year, category, createdAt } = route.params;

  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [taggedImages, setTaggedImages] = useState([]); // Store images with tags

  const tags = ['Engine', 'Interior', 'Exterior', 'Serial Number'];

  // Function to take a photo
  const takePhoto = async () => {
    if (!selectedTag) {
      alert('Please select a tag before taking a photo.');
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert('Camera access is required to take pictures.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTaggedImages([...taggedImages, { uri: result.assets[0].uri, tag: selectedTag }]);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{lotNumber} Details</Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>Lot Name: {lotName}</Text>
      <Text style={{ fontSize: 18 }}>Year: {year}</Text>
      <Text style={{ fontSize: 18 }}>Category: {category}</Text>
      <Text style={{ fontSize: 16, color: 'gray', marginBottom: 20 }}>Created At: {createdAt}</Text>

      {/* Description Input */}
      <TextInput
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        style={{ height: 40, width: '80%', borderWidth: 1, paddingLeft: 10, marginTop: 10 }}
      />

      {/* Quantity Input */}
      <TextInput
        placeholder="Enter Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={{ height: 40, width: '80%', borderWidth: 1, paddingLeft: 10, marginTop: 10 }}
      />

      {/* Tag Selection */}
      <Text style={{ fontSize: 16, marginTop: 20 }}>Select Tag for Photo:</Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => setSelectedTag(tag)}
            style={{
              padding: 10,
              backgroundColor: selectedTag === tag ? 'blue' : 'gray',
              marginHorizontal: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white' }}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Take Photo Button */}
      <Button title="Take Photo" onPress={takePhoto} />

      {/* Display Tagged Photos */}
      <View style={{ marginTop: 20 }}>
        {taggedImages.map((image, index) => (
          <View key={index} style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{image.tag}</Text>
            <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, borderRadius: 10 }} />
          </View>
        ))}
      </View>

      {/* Save and Go Back Buttons */}
      <Button title="Save" onPress={() => alert('Lot details saved!')} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default LotDetailsScreen;
