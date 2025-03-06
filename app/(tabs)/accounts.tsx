import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SimpleExample from '@/components/TagScrollView';

export default function AccountsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Accounts</ThemedText>
      <ThemedText>Your accounts will be displayed here</ThemedText>
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
