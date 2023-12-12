import {typography} from '@/Theme';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {ILoadingCaption} from './ILoadingCaption';

const LoadingCaption: React.FC<ILoadingCaption.IProps> = ({style}) => {
  const opacity = useSharedValue(1);
  const {t} = useTranslation();
  const firstText = t('great_picks');
  const secondText = t('curating_playbooks_and_gems');
  const [text, setText] = useState(firstText);

  useEffect(() => {
    opacity.value = withSequence(
      withDelay(2000, withTiming(0, {duration: 1000})),
      withDelay(200, withTiming(1, {duration: 1000})),
    );
  }, [opacity]);

  useDerivedValue(() => {
    if (opacity.value === 0) {
      runOnJS(setText)(secondText);
    }
  }, [secondText]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [],
  );

  return (
    <Animated.Text style={[styles.text, animatedStyle, style]}>
      {text}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...typography.h3,
  },
});

export default LoadingCaption;
