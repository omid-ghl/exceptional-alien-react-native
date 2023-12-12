import React from 'react';
import {Stack} from '@/Navigators/NavigationStack';
import {
  PersonalDetail,
  Nominate,
  HelpAndSupport,
  Contact,
  SendFeedback,
  Faq,
  FieldInterests,
  PlaceInterests,
  DeleteAccount,
  ChangeEmail,
  About,
  Settings,
  CreatePlaybook,
  ResetPassword,
} from './Screens';
import {Back} from '@/Commons';

export const settingsStackScreen = () => (
  <>
    <Stack.Group
      screenOptions={{
        headerShown: true,
        headerTitle: () => null,
        headerBackImage: () => <Back />,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="settings" component={Settings} />
      <Stack.Screen name="about" component={About} />
      <Stack.Screen name="changeEmail" component={ChangeEmail} />
      <Stack.Screen name="personalDetail" component={PersonalDetail} />
      <Stack.Screen name="helpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="contact" component={Contact} />
      <Stack.Screen name="sendFeedback" component={SendFeedback} />
      <Stack.Screen name="faq" component={Faq} />
      <Stack.Screen name="fieldInterests" component={FieldInterests} />
      <Stack.Screen name="placeInterests" component={PlaceInterests} />
      <Stack.Screen name="deleteAccount" component={DeleteAccount} />
      <Stack.Screen name="resetPassword" component={ResetPassword} />
    </Stack.Group>
    <Stack.Screen name="nominate" component={Nominate} />

    <Stack.Group
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
        headerTransparent: true,
        headerTitle: () => null,
        headerLeft: () => null,
        headerRight: () => null,
      }}>
      <Stack.Screen name="createPlaybook" component={CreatePlaybook} />
    </Stack.Group>
  </>
);
