import { FlatList, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LotCard } from '@/components/LotCard';
import { Menu, IconButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { azureService } from '@/services/azureService';
import { Lot } from '@/types/lot';

// Default image URL for lots without pictures
const DEFAULT_IMAGE_URL = 'https://picsum.photos/id/111/200/200';

export default function InventoryScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [menuVisible, setMenuVisible] = useState(false);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    loadLots();
  }, []);

  const loadLots = async () => {
    try {
      setLoading(true);
      const allLots = await azureService.getAllLots();
      setLots(allLots);
    } catch (err) {
      console.error('Error loading lots:', err);
      setError('Failed to load lots');
    } finally {
      setLoading(false);
    }
  };
  
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  const handleCreateLot = () => {
    closeMenu();
    router.push('/lot/create-new');
  };
  
  const handleLotPress = (lot: Lot) => {
    router.push({
      pathname: '/lot/edit',
      params: { lotId: lot.id }
    });
  };

  const getImageUrl = (lot: Lot) => {
    return lot.pictures && lot.pictures.length > 0 
      ? lot.pictures[0].url 
      : DEFAULT_IMAGE_URL;
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

      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
      
      <FlatList
        data={lots}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <LotCard
            title={item.title}
            lotNumber={item.lotNumber}
            tagNumber={item.tagNumber}
            imageUrl={getImageUrl(item)}
            index={index}
            onPress={() => handleLotPress(item)}
          />
        )}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight }
        ]}
        refreshing={loading}
        onRefresh={loadLots}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
