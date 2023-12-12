import React, {createContext} from 'react';

import {Home} from '@/Containers/home/Screens';
import {colors, fonts, SVG} from '@/Theme';
import {BottomTab} from '@/Navigators/NavigationStack';
import {Search} from '@/Containers/discover/Screens';
import {Profile} from '@/Containers/profile/Screens';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const BottomTabBarContext = createContext({});

const BottomTabBarNavigator = ({route: {params}}: {route: {params?: any}}) => {
  const insets = useSafeAreaInsets();
  return (
    <BottomTabBarContext.Provider value={params?.openTabName}>
      <BottomTab.Navigator
        initialRouteName={params?.initialActiveTab}
        screenOptions={({route}) => ({
          tabBarStyle: {
            height: 80 + insets.bottom / 2,
            paddingTop: 22,
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
          },
          headerShown: false,
          BottomTabBarHideOnKeyboard: true,
          tabBarIcon: ({focused}) => (
            <>
              {route.name === 'home' && (
                <SVG.Home stroke={focused ? colors.primary : colors.gray50} />
              )}
              {route.name === 'search' && (
                <SVG.Search stroke={focused ? colors.primary : colors.gray50} />
              )}
              {route.name === 'you' && (
                <SVG.Profile
                  stroke={focused ? colors.primary : colors.gray50}
                />
              )}
            </>
          ),
          tabBarLabelStyle: {
            fontFamily: fonts.medium,
            fontSize: 14,
            lineHeight: 14,
            textTransform: 'capitalize',
          },
          tabBarIconStyle: {
            height: 20,
            width: 20,
            flex: 0,
            marginBottom: 8,
          },
          tabBarItemStyle: {
            justifyContent: 'flex-start',
          },
          tabBarInactiveTintColor: colors.gray50,
          tabBarActiveTintColor: colors.primary,
        })}>
        <BottomTab.Screen name="home" component={Home} />
        <BottomTab.Screen name="search" component={Search} />
        <BottomTab.Screen name="you" component={Profile} />
      </BottomTab.Navigator>
    </BottomTabBarContext.Provider>
  );
};

export default BottomTabBarNavigator;
