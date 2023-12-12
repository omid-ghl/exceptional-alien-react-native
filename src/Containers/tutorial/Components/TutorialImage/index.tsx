import React from 'react';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Image, StyleSheet} from 'react-native';
import {ITutorialImage} from './ITutorialImage';

const TutorialImage: React.FC<ITutorialImage.IProps> = ({
  fadeFromTop,
  image,
  animationDuration = 1000,
}) => {
  return (
    <Animated.View
      style={styles.imageContainer}
      entering={FadeInDown.duration(animationDuration).delay(animationDuration)}
      exiting={FadeOutDown.duration(animationDuration)}>
      <LinearGradient
        colors={['#FFFFFF00', '#FFFFFFFF']}
        style={fadeFromTop ? styles.gradientTop : styles.gradientBottom}
        pointerEvents="none"
        start={{x: 0, y: 0}}
        end={fadeFromTop ? {x: 0, y: 0.7} : {x: 0, y: 0.5}}
      />
      <Image source={image} style={[styles.image]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    marginTop: 60,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 49.5,
    elevation: 49,
  },
  gradientBottom: {
    height: 273,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    transform: [{translateY: 60}],
  },
  gradientTop: {
    height: 273,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    transform: [{rotate: '180deg'}],
  },
});

export default TutorialImage;
