import React from 'react';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';
import {ITutorialContent} from './ITutorialContent';
import {colors, typography} from '@/Theme';

const TutorialContent: React.FC<ITutorialContent.IProps> = ({
  title,
  description,
  animationDuration = 1000,
}) => {
  return (
    <>
      <Animated.Text
        style={styles.title}
        entering={FadeInDown.duration(animationDuration).delay(
          animationDuration,
        )}
        exiting={FadeOutDown.duration(animationDuration)}>
        {title}
      </Animated.Text>
      <Animated.Text
        style={styles.description}
        entering={FadeInDown.duration(animationDuration).delay(
          animationDuration,
        )}
        exiting={FadeOutDown.duration(animationDuration)}>
        {description}
      </Animated.Text>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.h2,
    alignSelf: 'center',
    textAlign: 'center',
    width: '80%',
  },
  description: {
    ...typography.h5,
    color: colors.gray100,
    alignSelf: 'center',
    textAlign: 'center',
    width: '80%',
    marginTop: 8,
    marginBottom: 64,
  },
});

export default TutorialContent;
