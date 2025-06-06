import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ApprovalsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Approvals</ThemedText>
      <ThemedText>Your approvals will be displayed here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});