import {StyleProp, ViewStyle} from 'react-native';

declare namespace IProgressButton {
  interface IProps {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    percent?: number;
  }
}

export {IProgressButton};
