import React from 'react';
import {Stack} from '@/Navigators/NavigationStack';
import GetStarted from './Screens/GetStarted';
import Splash from './Screens/Splash';
import SyncAppVersion from './Screens/SyncAppVersion';

const getStartedNavigation = () => (
  <>
    <Stack.Screen name="splash" component={Splash} />
    <Stack.Screen name="getStarted" component={GetStarted} />
    <Stack.Screen name="syncAppVersion" component={SyncAppVersion} />
  </>
);

export default getStartedNavigation;
