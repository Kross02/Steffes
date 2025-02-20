import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type AuctionCardProps = {
  title: string;
  location: string;
  closingDate: string;
  imageUrl: string;
  index: number;
};

export function AuctionCard({ title, location, closingDate, imageUrl, index }: AuctionCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }]}>
      <View style={styles.contentContainer}>
        <ThemedText type="defaultSemiBold" style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.location}>{location}</ThemedText>
        <ThemedText style={styles.date}>Closes: {closingDate}</ThemedText>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});