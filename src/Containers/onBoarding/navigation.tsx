import React from 'react';
import {Stack} from '@/Navigators/NavigationStack';
import {OnboardingLoading, SelectIndustries, SelectLocations} from './Screens';

const onBoardingNavigation = () => (
  <Stack.Group
    screenOptions={{
      headerShown: true,
      headerTransparent: true,
      headerTitle: () => null,
    }}>
    <Stack.Screen name="selectLocations" component={SelectLocations} />
    <Stack.Screen name="selectIndustries" component={SelectIndustries} />
    <Stack.Screen
      name="onboardingLoading"
      component={OnboardingLoading}
      options={{headerShown: false}}
    />
  </Stack.Group>
);

export default onBoardingNavigation;
