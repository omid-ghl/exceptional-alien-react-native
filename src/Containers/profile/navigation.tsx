import {Back} from '@/Commons';
import {Stack} from '@/Navigators/NavigationStack';
import React from 'react';
import {AddGems, YourGemsByPlaybook, YourPlaybooks} from './Screens';

export const profileNavigation = () => (
  <>
    <Stack.Screen name="yourPlaybooks" component={YourPlaybooks} />
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerTransparent: false,
        headerTitle: () => null,
        headerLeft: () => <Back />,
        headerRight: () => null,
      }}>
      <Stack.Screen name="yourGemsByPlaybook" component={YourGemsByPlaybook} />
    </Stack.Group>
  </>
);
