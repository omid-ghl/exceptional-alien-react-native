import Animated from 'react-native-reanimated';

declare namespace IGetStartedButton {
  interface IProps {
    carouselProgress: Animated.SharedValue<number>;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
  }
}

export {IGetStartedButton};
