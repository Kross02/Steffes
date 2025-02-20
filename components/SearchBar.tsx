import { StyleSheet, TextInput, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

export function SearchBar() {
  return (
    <View style={styles.container}>
      <IconSymbol name="search" size={20} color="#666" />
      <TextInput
        placeholder="Search auctions..."
        style={styles.input}
        placeholderTextColor="#666"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});