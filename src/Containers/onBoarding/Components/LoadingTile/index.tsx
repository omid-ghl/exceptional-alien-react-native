import {colors} from '@/Theme';
import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {ILoadingTile} from './ILoadingTile';

const LoadingTile: React.FC<ILoadingTile.IProps> = ({
  imageUrl,
  startAnimationFrom,
  style,
  offsetX = 0,
}) => {
  const start = startAnimationFrom === 'top' ? 4 : -4;
  const end = -1 * start;
  const offset = useSharedValue(start);

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withDelay(1000, withTiming(end, {duration: 1000})),
        withDelay(1000, withTiming(start, {duration: 1000})),
      ),
      -1,
      false,
    );
  }, [offset, startAnimationFrom, start, end]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{translateY: offset.value}, {translateX: offsetX}],
    }),
    [offsetX],
  );

  return (
    <Animated.View style={[styles.tile, animatedStyle, style]}>
      <Image
        source={imageUrl ? {uri: imageUrl, width: 64, height: 64} : undefined}
        style={styles.image}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 25,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    elevation: 25,
  },
  image: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.white,
    width: 64,
    height: 64,
  },
  mask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default LoadingTile;
