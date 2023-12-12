import React, {ComponentProps} from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import {StyleSheet} from 'react-native';
import {colors, SVG, variables} from '@/Theme';
import CustomTabBar from './CustomTabBar';
import CustomTabBarIndicator from './CustomTabBarIndicator';
import {ITabs} from './Tabs';
import {Host} from 'react-native-portalize';

const createTabs = () => {
  const Tabs = createMaterialTopTabNavigator();

  const CustomTabsNavigator = ({
    children,
    screenOptions,
    ...props
  }: ComponentProps<typeof Tabs.Navigator>) => {
    const propOptions = screenOptions as
      | MaterialTopTabNavigationOptions
      | undefined;
    return (
      <Host>
        <Tabs.Navigator
          {...props}
          style={[styles.navigatorStyle, props.style]}
          tabBar={tabBarProps => <CustomTabBar {...tabBarProps} />}
          screenOptions={{
            tabBarPressColor: 'transparent',
            tabBarShowIcon: true,
            tabBarActiveTintColor: colors.white,
            tabBarInactiveTintColor: colors.black,
            ...screenOptions,
            tabBarIndicator: indicatorProps => (
              <CustomTabBarIndicator
                navigationState={indicatorProps.state}
                {...indicatorProps}
              />
            ),
            tabBarItemStyle: [styles.flexRow],
            tabBarStyle: [styles.tabBar, propOptions?.tabBarStyle],
            tabBarIndicatorContainerStyle: [
              styles.tabBarIndicatorContainer,
              propOptions?.tabBarIndicatorContainerStyle,
            ],
            tabBarIndicatorStyle: [
              styles.tabBarIndicator,
              propOptions?.tabBarIndicatorStyle,
            ],
            tabBarLabelStyle: [
              styles.tabBarLabel,
              propOptions?.tabBarLabelStyle,
            ],
            tabBarContentContainerStyle: [
              styles.tabBarContentContainer,
              propOptions?.tabBarContentContainerStyle,
            ],
          }}>
          {children}
        </Tabs.Navigator>
      </Host>
    );
  };
  const CustomTabs: ITabs.CustomTabsType = {
    Screen: Tabs.Screen,
    Group: Tabs.Group,
    Navigator: CustomTabsNavigator,
  };
  return CustomTabs;
};

const styles = StyleSheet.create({
  navigatorStyle: {
    backgroundColor: colors.white,
  },
  tabBar: {
    backgroundColor: colors.white,
    borderRadius: 24,
    height: 44,
    marginHorizontal: variables.metricsSizes.regular,
    shadowOffset: {height: 3.5, width: 0},
    shadowRadius: 25,
    shadowOpacity: 0.15,
    shadowColor: '#000',
    elevation: 25,
  },
  tabBarIndicatorContainer: {
    width: '95%',
  },
  tabBarIndicator: {
    backgroundColor: colors.primary,
    height: 30,
    marginBottom: 7,
    borderRadius: 20,
  },
  tabBarLabel: {
    fontWeight: 'bold',
    textTransform: 'none',
  },
  tabBarContentContainer: {
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default createTabs;
