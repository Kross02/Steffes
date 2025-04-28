import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, FlatList } from 'react-native';

const AuctionsPage = ({ navigation }) => { // Access navigation prop
  const [sellerName, setSellerName] = useState(''); // Store the current seller name
  const [showInput, setShowInput] = useState(false); // Controls the visibility of the input field
  const [sellers, setSellers] = useState([]); // Stores the list of created sellers

  // Handle the creation of a new seller
  const handleCreateSeller = () => {
    if (sellerName.trim() !== '') {
      setSellers([...sellers, sellerName]); // Add the new seller to the list
      setSellerName(''); // Reset the input field after creating the seller
      setShowInput(false); // Hide the text input field after creation
    }
  };

  // Handle clicking on a seller's name to navigate to SellerDetailsScreen
  const handleSellerClick = (name) => {
    navigation.navigate('SellerDetails', { sellerName: name }); // Pass sellerName to SellerDetailsScreen
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 }}>
      {/* Create Seller Button */}
      <Button title="Create Seller" onPress={() => setShowInput(true)} />

      {/* Show the TextInput when showInput is true */}
      {showInput && (
        <>
          <TextInput
            placeholder="Enter Seller Name"
            value={sellerName}
            onChangeText={setSellerName}
            style={{
              height: 40,
              width: '80%',
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 5,
              paddingLeft: 10,
              marginTop: 20,
            }}
          />
          <Button title="Add Seller" onPress={handleCreateSeller} />
        </>
      )}

      {/* List of created sellers */}
      {sellers.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18 }}>Created Sellers:</Text>
          <FlatList
            data={sellers}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSellerClick(item)}>
                <View
                  style={{
                    marginVertical: 10,
                    padding: 15,
                    borderRadius: 10,
                    backgroundColor: '#f8f8f8',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    width: '80%',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, color: 'blue' }}>{item}</Text>
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

export default AuctionsPage;
