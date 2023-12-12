import Animated from 'react-native-reanimated';

declare namespace ICarouselItem {
  interface IProps {
    animationValue: Animated.SharedValue<number>;
    image: any;
    title: string;
    index: number;
  }
}

export {ICarouselItem};
