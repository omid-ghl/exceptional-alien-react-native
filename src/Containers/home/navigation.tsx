import React from 'react';
import {Stack} from '@/Navigators/NavigationStack';
import {
  GemDetails,
  PlayBookDetails,
  MapView,
  StoryDetails,
  PartnershipDetails,
  VideoView,
  PartnershipStoryDetails,
} from './Screens';
import {TransitionPresets} from '@react-navigation/stack';

export const homeStackScreens = () => (
  <>
    <Stack.Screen name="gemDetails" component={GemDetails} />
    <Stack.Screen name="playBookDetails" component={PlayBookDetails} />
    <Stack.Screen name="storyDetails" component={StoryDetails} />
    <Stack.Screen name="partnershipDetails" component={PartnershipDetails} />
    <Stack.Screen
      name="partnershipStoryDetails"
      component={PartnershipStoryDetails}
    />
    <Stack.Screen name="mapView" component={MapView} />
    <Stack.Screen
      name="videoView"
      component={VideoView}
      options={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    />
  </>
);
