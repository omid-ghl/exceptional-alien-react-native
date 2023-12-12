import React, {useRef} from 'react';
import {Linking, Platform, StatusBar, StyleSheet} from 'react-native';
import {
  getStateFromPath,
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from '@react-navigation/native';

import {navigationRef} from './NavigationService';
import {getStartedNavigation} from '@/Containers/started';
import {authNavigation} from '@/Containers/auth';
import {Stack} from './NavigationStack';
import TabBarNavigator from '@/Navigators/TabBarNavigator';
import {homeStackScreens} from '@/Containers/home';
import {Back} from '@/Commons';
import {onBoardingNavigation} from '@/Containers/onBoarding';
import {tutorialNavigation} from '@/Containers/tutorial';
import {settingsStackScreen} from '@/Containers/settings';
import {discoverNavigation} from '@/Containers/discover';
import {Host} from 'react-native-portalize';
import {profileNavigation} from '@/Containers/profile';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {StackParamList} from './Stacks';
import {useAppSelector} from '@/Hooks';
import {DynamicShare, SentryHelper} from '@/Services';

export const ApplicationNavigator = () => {
  const token = useAppSelector(state => state.auth.token);
  const routeNameRef = useRef<string>();
  return (
    <NavigationContainer
      ref={navigationRef as NavigationContainerRefWithCurrent<StackParamList>}
      linking={{
        prefixes: [
          'com.exceptionalalien.app://',
          'https://exceptionalalien.com',
        ],
        config: {
          initialRouteName: 'tabBar',
          screens: {
            playBookDetails: 'playbooks/*',
            gemDetails: {
              path: 'gems/*',
              parse: {
                gemId: DynamicShare.parseGemShareLinkSuffixToGemId,
              },
            },
            partnershipDetails: 'partnerships/:partnershipId',
            tabBar: '*',
          },
        },
        async getInitialURL() {
          // Check if there is an initial firebase dynamic link
          const initialDynamicLink = await dynamicLinks().getInitialLink();

          if (initialDynamicLink?.url) {
            console.log(
              '🔗 Received initial dynamic link:',
              initialDynamicLink?.url,
            );
            return initialDynamicLink.url;
          }

          // Check if app was opened from a deep link
          const url = await Linking.getInitialURL();

          if (url != null) {
            return url;
          }

          return null;
        },
        subscribe(listener) {
          const handleDynamicLink = (
            dynamicLink: FirebaseDynamicLinksTypes.DynamicLink,
          ) => {
            console.log('🔗 Received dynamic link:', dynamicLink.url);
            listener(dynamicLink.url);
          };

          // Listen to firebase dynamic links incoming
          const unsubscribeToDynamicLinks =
            dynamicLinks().onLink(handleDynamicLink);

          const onReceiveURL = ({url}: {url: string}) => listener(url);

          // Listen to incoming links from deep linking
          const subscription = Linking.addEventListener('url', onReceiveURL);

          return () => {
            // Clean up the event listeners
            subscription.remove();
            unsubscribeToDynamicLinks();
          };
        },
        getStateFromPath: (path, config) => {
          if (path.includes('#gem')) {
            path = path
              .replace('share/playbook/', 'gems/somewhere?gemId=')
              .replace('playbooks/', 'gems/')
              .replace('b=', 'gemId=');
          } else {
            path = path
              .replace('share/playbook/', 'playbooks/somewhere?slug=')
              .replace('b=', 'slug=');
          }
          console.log('path', path);
          if (token && token.length > 4) {
            return getStateFromPath(path, config);
          }
          return {
            routes: [
              {
                name: 'splash',
                params: {
                  goToUrl: () => {
                    navigationRef.reset(
                      getStateFromPath(path, config) ?? {
                        routes: [
                          {
                            name: 'tabBar',
                          },
                        ],
                      },
                    );
                  },
                },
              },
            ],
          };
        },
      }}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
        SentryHelper.routingInstrumentation.registerNavigationContainer(
          navigationRef,
        );
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (currentRouteName && previousRouteName !== currentRouteName) {
          try {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          } catch (error) {}
        }
        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <Host>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerBackImage: () => <Back />,
            headerLeftContainerStyle: styles.headerLeftContainer,
          }}
          initialRouteName="splash">
          {getStartedNavigation()}
          {authNavigation()}
          <Stack.Screen name="tabBar" component={TabBarNavigator} />
          {homeStackScreens()}
          {onBoardingNavigation()}
          {tutorialNavigation()}
          {settingsStackScreen()}
          {discoverNavigation()}
          {profileNavigation()}
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerLeftContainer: {
    paddingLeft: 12,
  },
});
