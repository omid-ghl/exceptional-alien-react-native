import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, ScrollView, StyleSheet, StatusBar} from 'react-native';
import {ICollapsingHeader} from './CollapsingHeader';
import {colors, variables} from '@/Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CollapsingHeader: React.FC<ICollapsingHeader.IProps> = props => {
  const {
    FixedContent,
    MaxContent,
    MinContent,
    MaxHeight = variables.dimensions.height * 0.65,
    MinHeight = 56,
    children,
  } = props;
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const [statusBarStyle, setStatusBarStyle] = useState<
    'light-content' | 'dark-content'
  >('light-content');

  const headerHeight = scrollOffsetY.interpolate({
    inputRange: [0, MaxHeight - MinHeight],
    outputRange: [MaxHeight, MinHeight],
    extrapolate: 'clamp',
  });
  const headerHeightOverlap = scrollOffsetY.interpolate({
    inputRange: [0, MaxHeight - MinHeight],
    outputRange: [MaxHeight - 30, MinHeight - 30],
    extrapolate: 'clamp',
  });
  const headerMargin = scrollOffsetY.interpolate({
    inputRange: [0, MaxHeight - MinHeight],
    outputRange: [MinHeight * -1, MaxHeight * -1],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollOffsetY.interpolate({
    inputRange: [0, MaxHeight - MinHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const heroTitleOpacity = scrollOffsetY.interpolate({
    inputRange: [0, MaxHeight - MinHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const listener = scrollOffsetY.addListener(offset => {
      if (
        offset.value >= MaxHeight - MinHeight &&
        statusBarStyle !== 'dark-content'
      ) {
        setStatusBarStyle('dark-content');
      } else if (
        offset.value < MaxHeight - MinHeight &&
        statusBarStyle !== 'light-content'
      ) {
        setStatusBarStyle('light-content');
      }
    });

    return () => scrollOffsetY.removeListener(listener);
  }, [MaxHeight, MinHeight, scrollOffsetY, statusBarStyle]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={statusBarStyle}
        animated
      />
      <View
        style={[
          styles.fixedContainer,
          {
            top: Math.max(20, insets.top + 5),
          },
        ]}>
        {FixedContent}
      </View>

      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <Animated.View
          style={{
            opacity: headerTitleOpacity,
          }}>
          {MinContent}
        </Animated.View>
        <Animated.View
          style={{
            opacity: heroTitleOpacity,
            height: headerHeight,
            marginTop: headerMargin,
          }}>
          {MaxContent}
        </Animated.View>
        <View
          style={[
            styles.fixedContainer,
            {
              top: Math.max(20, insets.top + 5),
            },
          ]}>
          {FixedContent}
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.borderSectionOnImage, {top: headerHeightOverlap}]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          {paddingTop: MaxHeight},
        ]}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollOffsetY,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 3,
  },
  fixedContainer: {
    position: 'absolute',
    zIndex: 4,
  },
  borderSectionOnImage: {
    width: variables.dimensions.width,
    height: 32,
    backgroundColor: colors.white,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 3,
  },
});

export default CollapsingHeader;
