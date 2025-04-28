import { Tabs } from 'expo-router'; // Import Tabs from expo-router
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';  // If you have custom icons for tabs
import TabBarBackground from '@/components/ui/TabBarBackground'; // Custom background for tab bar
import { Colors } from '@/constants/Colors'; // Colors from your theme
import { useColorScheme } from '@/hooks/useColorScheme'; // Hook for color scheme (light/dark)

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,  // Disable headers for tabs here
        tabBarButton: HapticTab,  // Custom tab bar button (if any)
        tabBarBackground: TabBarBackground,  // Custom tab bar background
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="auctions"  // Ensure this is linked to AuctionsPage
        options={{
          title: 'Auctions',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="auction" color={color} />,
        }}
      />
      {/* Add other tabs for Inventory, Profile, etc. */}
    </Tabs>
  );
}
