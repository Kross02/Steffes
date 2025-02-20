import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import { AuctionCard } from '@/components/AuctionCard';

const DUMMY_AUCTIONS = [
  {
    id: '1',
    title: 'Farm Equipment Auction',
    location: 'Fargo, ND',
    closingDate: 'Mar 15, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: '2',
    title: 'Construction Equipment Sale',
    location: 'Bismarck, ND',
    closingDate: 'Mar 18, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: '3',
    title: 'Bradenburg Farm Equipment Auction',
    location: 'Fargo, ND',
    closingDate: 'Mar 15, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=3',
  },
  {
    id: '4',
    title: 'Red River Valley Farm Equipment Auction',
    location: 'Grand Forks, ND',
    closingDate: 'Mar 18, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=4',
  },
  {
    id: '5',
    title: 'Tim and Sheri Wegner Retirement Auction',
    location: 'Bulla, ND',
    closingDate: 'Mar 15, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=5',
  },
  {
    id: '6',
    title: '5 Star Dairy LLC Auction',
    location: 'Stewartville, MN',
    closingDate: 'Mar 18, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=6',
  },
  {
    id: '7',
    title: 'Retterrath Farms Auction',
    location: 'Bombay, ND',
    closingDate: 'Mar 15, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=7',
  },
  {
    id: '8',
    title: 'Jason Kadrmas Auction',
    location: 'Montecello, MN',
    closingDate: 'Mar 18, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=8',
  },
  {
    id: '9',
    title: 'Matjcek Farms Excess Equipment Auction',
    location: 'Hillsboro, ND',
    closingDate: 'Mar 15, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=9',
  },
  {
    id: '10',
    title: 'Norman County, MN Land Auction',
    location: 'Norman County, MN',
    closingDate: 'Mar 18, 2024',
    imageUrl: 'https://picsum.photos/200/200?random=10',
  },
  // Add 8 more similar items with different dates and locations
];

export default function AuctionsScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Auctions</ThemedText>
        <ThemedText style={styles.subtitle}>Browse available auctions</ThemedText>
      </View>
      
      <SearchBar />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 20 // Add extra padding at bottom
        }}
      >
        {DUMMY_AUCTIONS.map((auction, index) => (
          <AuctionCard
            key={auction.id}
            index={index}
            title={auction.title}
            location={auction.location}
            closingDate={auction.closingDate}
            imageUrl={auction.imageUrl}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  subtitle: {
    color: '#666',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
});
