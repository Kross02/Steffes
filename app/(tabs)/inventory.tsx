import { FlatList, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LotCard } from '@/components/LotCard';
import { Menu, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useRouter } from 'expo-router';

// Sample data for lots
const sampleLots = [
  {
    id: '1',
    title: 'John Deere Tractor',
    lotNumber: '1001',
    tagNumber: 'T-5432',
    imageUrl: 'https://picsum.photos/id/111/200/200',
  },
  {
    id: '2',
    title: 'Caterpillar Excavator',
    lotNumber: '1002',
    tagNumber: 'T-6789',
    imageUrl: 'https://picsum.photos/id/133/200/200',
  },
  {
    id: '3',
    title: 'Kubota Mower',
    lotNumber: '1003',
    tagNumber: 'T-1234',
    imageUrl: 'https://picsum.photos/id/155/200/200',
  },
  {
    id: '4',
    title: 'Ford F-150 Truck',
    lotNumber: '1004',
    tagNumber: 'T-8765',
    imageUrl: 'https://picsum.photos/id/183/200/200',
  },
  {
    id: '5',
    title: 'Bobcat Skid Steer',
    lotNumber: '1005',
    tagNumber: 'T-9012',
    imageUrl: 'https://picsum.photos/id/192/200/200',
  },
];

export default function InventoryScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  const handleCreateLot = () => {
    closeMenu();
    router.push('/lot/create-new');
  };
  
  const handleLotPress = (lot: { id: string; title: string; lotNumber: string; tagNumber: string; imageUrl: string }) => {
    router.push({
      pathname: '/lot/edit',
      params: { lotId: lot.id }
    });
  };
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.header}>Inventory</ThemedText>
        
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item onPress={handleCreateLot} title="Create Lot" />
        </Menu>
      </View>
      
      <FlatList
        data={sampleLots}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <LotCard
            title={item.title}
            lotNumber={item.lotNumber}
            tagNumber={item.tagNumber}
            imageUrl={item.imageUrl}
            index={index}
            onPress={() => handleLotPress(item)}
          />
        )}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight }
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50, // Add top padding for clearance
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  header: {
    flex: 1,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
  },
});
