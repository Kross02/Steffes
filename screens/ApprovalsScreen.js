// /screens/ApprovalsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ApprovalsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Approvals Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApprovalsScreen;
