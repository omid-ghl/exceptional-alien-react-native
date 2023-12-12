import {Back} from '@/Commons';
import {Stack} from '@/Navigators/NavigationStack';
import React from 'react';
import {DiscoverLocations, Search} from './Screens';

export const discoverNavigation = () => (
  <>
    <Stack.Screen name="search" component={Search} />
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: () => null,
        headerRight: () => null,
        headerLeft: () => <Back />,
      }}>
      <Stack.Screen name="discoverLocations" component={DiscoverLocations} />
    </Stack.Group>
  </>
);
