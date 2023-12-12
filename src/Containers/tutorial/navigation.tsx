import React from 'react';
import {Stack} from '@/Navigators/NavigationStack';
import {Tutorial} from './Screens';
import {HeaderClose} from '@/Commons';

const tutorialNavigation = () => (
  <Stack.Group
    screenOptions={{
      presentation: 'modal',
      headerShown: true,
      headerTransparent: true,
      headerTitle: () => null,
      headerLeft: () => null,
      headerRight: () => <HeaderClose />,
    }}>
    <Stack.Screen name="tutorial" component={Tutorial} />
  </Stack.Group>
);

export default tutorialNavigation;
