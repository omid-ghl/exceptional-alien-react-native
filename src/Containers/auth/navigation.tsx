import React from 'react';
import {Stack} from '@/Navigators/NavigationStack';
import {
  Auth,
  ForgotPassword,
  ForgotPasswordLinkSent,
  EmailSent,
} from './Screens';
import {HeaderClose} from '@/Commons';

export const authNavigation = () => (
  <>
    <Stack.Screen name="auth" component={Auth} />
    <Stack.Screen name="forgotPassword" component={ForgotPassword} />
    <Stack.Group
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
        headerTransparent: true,
        headerTitle: () => null,
        headerLeft: () => null,
        headerRight: () => <HeaderClose />,
      }}>
      <Stack.Screen
        name="forgotPasswordLinkSent"
        component={ForgotPasswordLinkSent}
      />
      <Stack.Screen name="emailSent" component={EmailSent} />
    </Stack.Group>
  </>
);
