import {colors, typography} from '@/Theme';
import React from 'react';
import {ImageBackground, StyleSheet, Text} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {IInterest} from './InterestItem';

const InterestItem: React.FC<IInterest.IProps> = ({
  text,
  imageUrl,
  selected,
  onPress,
}) => {
  const selectedAnimated = useDerivedValue(() => {
    if (selected) {
      return withTiming(1, {duration: 200});
    } else {
      return withTiming(0, {duration: 200});
    }
  }, [selected]);

  const maskStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      selectedAnimated.value,
      [0, 1],
      ['rgba(0, 0, 0, 0.25)', 'rgba(35, 43, 190, 0.8)'],
    ),
  }));

  return (
    <TouchableWithoutFeedback containerStyle={styles.card} onPress={onPress}>
      <ImageBackground
        source={imageUrl ? {uri: imageUrl} : undefined}
        style={styles.imageContainer}
        imageStyle={styles.image}>
        <Animated.View style={[styles.mask, maskStyle]}>
          <Text style={styles.text}>{text}</Text>
        </Animated.View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 10,
    margin: 4,
    overflow: 'hidden',
  },
  text: {
    ...typography.h5,
    color: colors.white,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    minHeight: 64,
  },
  image: {
    borderRadius: 10,
  },
  mask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default InterestItem;
