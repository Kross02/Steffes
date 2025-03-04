import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SellerDetailsScreen = ({ route }) => {
  const { sellerName } = route.params; // Access the seller's name passed in the route

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{sellerName}</Text>
      {/* Other content for SellerDetails */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SellerDetailsScreen;
