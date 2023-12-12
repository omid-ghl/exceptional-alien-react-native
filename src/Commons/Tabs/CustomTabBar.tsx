import {colors} from '@/Theme';
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const CustomTabBar = (props: MaterialTopTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      <MaterialTopTabBar {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: colors.white,
    zIndex: 1,
  },
});

export default CustomTabBar;
