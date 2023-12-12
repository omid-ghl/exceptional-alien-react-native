import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {colors, typography} from '@/Theme';
import {ICarouselItem} from './CarouselItem';

const CarouselItem: React.FC<ICarouselItem.IProps> = ({
  animationValue,
  image,
  title,
  index,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0.4, 1, 0.4],
    );

    return {
      opacity,
    };
  }, [animationValue]);

  const isFirst = index === 0;

  return (
    <Animated.View style={[styles.carouselItem, animatedStyle]}>
      <Image source={image} style={styles.itemImage} />
      <Text
        style={[
          typography.h3,
          styles.itemTitle,
          isFirst && typography.h1,
          isFirst && styles.firstItemTitle,
        ]}>
        {title}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    flexDirection: 'column',
  },
  itemImage: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
    resizeMode: 'contain',
  },
  itemTitle: {
    textAlign: 'center',
    marginTop: 0,
    color: colors.primary,
    width: '85%',
    alignSelf: 'center',
  },
  firstItemTitle: {
    color: colors.white,
  },
});

export default CarouselItem;
