import { Stack } from 'expo-router';
import React from 'react';

export default function LotLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create-new"
        options={{
          title: 'Create Lot',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Lot',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 