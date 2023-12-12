import React, {ComponentProps} from 'react';
import {StyleSheet, View} from 'react-native';
import {Host} from 'react-native-portalize';
import {TabBarIndicator} from 'react-native-tab-view';

const CustomTabBarIndicator = (
  props: ComponentProps<typeof TabBarIndicator>,
) => {
  return (
    <View style={styles.tabBarIndicatorWrapper}>
      <Host>
        <TabBarIndicator {...props} />
      </Host>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarIndicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    marginRight: 8,
    marginLeft: 8,
  },
});

export default CustomTabBarIndicator;
