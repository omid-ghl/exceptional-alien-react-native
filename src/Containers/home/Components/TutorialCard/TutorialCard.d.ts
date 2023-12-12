import {StyleProp, ViewStyle} from 'react-native';

declare namespace ITutorial {
  interface IProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
  }
}

export {ITutorial};
