import React, { useState } from 'react';
import { View, Button, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';

const InventoryScreen = ({ navigation }) => {
  const [lotCounter, setLotCounter] = useState(1); // Counter for unique lot numbers
  const [lots, setLots] = useState([]); // Stores created lots

  // Input fields for new lot details
  const [lotName, setLotName] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');

  // Function to create a new lot
  const handleCreateLot = () => {
    if (!lotName || !year || !category) {
      alert('Please enter all details before creating a lot.');
      return;
    }

    const newLot = {
      lotNumber: `Lot-${lotCounter}`,
      lotName,
      year,
      category,
      createdAt: new Date().toLocaleString(), // Store creation time
    };

    setLots([...lots, newLot]); // Add the new lot to the list
    setLotCounter(lotCounter + 1); // Increment counter

    // Clear input fields
    setLotName('');
    setYear('');
    setCategory('');
  };

  // Navigate to LotDetailsScreen with selected lot details
  const handleLotClick = (lot) => {
    navigation.navigate('LotDetails', lot);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 20 }}>
      {/* Input Fields */}
      <TextInput
        placeholder="Enter Lot Name"
        value={lotName}
        onChangeText={setLotName}
        style={{ height: 40, width: '80%', borderWidth: 1, paddingLeft: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter Year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={{ height: 40, width: '80%', borderWidth: 1, paddingLeft: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter Category"
        value={category}
        onChangeText={setCategory}
        style={{ height: 40, width: '80%', borderWidth: 1, paddingLeft: 10, marginBottom: 10 }}
      />

      {/* Create Lot Button */}
      <Button title="Create Lot" onPress={handleCreateLot} />

      {/* Display Created Lots */}
      {lots.length > 0 && (
        <View style={{ marginTop: 20, width: '80%' }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Created Lots:</Text>
          <FlatList
            data={lots}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleLotClick(item)}>
                <View
                  style={{
                    marginVertical: 5,
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor: '#f8f8f8',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.lotNumber}</Text>
                  <Text style={{ fontSize: 14, color: 'gray' }}>({item.lotName}, {item.year})</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default InventoryScreen;
