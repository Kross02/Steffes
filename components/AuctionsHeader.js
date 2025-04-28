import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the 3 dots icon

const AuctionsHeader = () => {
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility

  // Function to toggle the modal visibility
  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      {/* Search bar */}
      <TextInput
        placeholder="Search Auctions..."
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
          paddingLeft: 10,
          flex: 1,
        }}
      />

      {/* 3 dots menu */}
      <TouchableOpacity onPress={toggleModal}>
        <Ionicons name="ellipsis-vertical" size={24} color="black" style={{ marginLeft: 10 }} />
      </TouchableOpacity>

      {/* Modal for 3 buttons */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              width: 250,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              Select an Option
            </Text>
            {/* Button 1 */}
            <Button
              title="QR Code Scanner"
              onPress={() => {
                // Handle QR Code Scanner action
                console.log('QR Code Scanner pressed');
                toggleModal();
              }}
            />
            {/* Button 2 */}
            <Button
              title="Duplicate Lot"
              onPress={() => {
                // Handle Duplicate Lot action
                console.log('Duplicate Lot pressed');
                toggleModal();
              }}
            />
            {/* Button 3 */}
            <Button
              title="Edit Photos"
              onPress={() => {
                // Handle Edit Photos action
                console.log('Edit Photos pressed');
                toggleModal();
              }}
            />

            {/* Close Button */}
            <Button
              title="Close"
              onPress={toggleModal}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AuctionsHeader;
