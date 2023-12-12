import React, {useState} from 'react';
import {TouchableHighlight, StyleSheet} from 'react-native';

import {colors, fonts} from '@/Theme';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {IGetStartedButton} from './GetStartedButton';
import {useTranslation} from 'react-i18next';

const GetStartedButton = (props: IGetStartedButton.IProps) => {
  const {t} = useTranslation();
  const {onPress, style, carouselProgress} = props;

  const nextStr = t('next');
  const getStartedStr = t('get_started');

  const [text, setText] = useState(getStartedStr);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      carouselProgress.value,
      [0, 1],
      [colors.white, colors.primary],
    ),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      carouselProgress.value,
      [0, 1],
      [colors.primary, colors.white],
    ),
  }));

  useDerivedValue(() => {
    if (carouselProgress.value >= 0.8 && text !== nextStr) {
      runOnJS(setText)(nextStr);
    } else if (carouselProgress.value < 0.8 && text !== getStartedStr) {
      runOnJS(setText)(getStartedStr);
    }
  }, [text]);

  return (
    <TouchableHighlight
      underlayColor={colors.gray100}
      onPress={onPress}
      style={[styles.buttonStyle, style]}>
      <Animated.View style={[styles.content, buttonAnimatedStyle]}>
        <Animated.Text style={[styles.textStyle, textAnimatedStyle]}>
          {text}
        </Animated.Text>
      </Animated.View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.white,
  },
});

export default GetStartedButton;
