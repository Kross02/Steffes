import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import AuctionsPage from '../screens/AuctionsPage';
import AuctionsHeader from '../components/AuctionsHeader';
import InventoryScreen from '../screens/InventoryScreen';
import LotDetailsScreen from '../screens/LotDetailsScreen'; // Import Lot Details Screen
import ApprovalsScreen from '../screens/ApprovalsScreen';
import AccountsScreen from '../screens/AccountsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellerDetailsScreen from '../screens/SellerDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Auctions
function AuctionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Auctions"
        component={AuctionsPage}
        options={{ headerTitle: () => <AuctionsHeader /> }}
      />
      <Stack.Screen
        name="SellerDetails"
        component={SellerDetailsScreen}
        options={({ route }) => ({
          title: route.params?.sellerName || 'Seller Details',
        })}
      />
    </Stack.Navigator>
  );
}

// 🛠️ Stack Navigator for Inventory (FIXED)
function InventoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="LotDetails" component={LotDetailsScreen} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Auctions" component={AuctionsStack} />
      <Tab.Screen name="Inventory" component={InventoryStack} />
      <Tab.Screen name="Approvals" component={ApprovalsScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default AppNavigator;
