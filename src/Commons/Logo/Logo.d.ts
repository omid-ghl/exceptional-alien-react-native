import {StyleProp, TextStyle, ViewStyle} from 'react-native';

declare namespace ILogo {
  interface IProps {
    fontSize?: number;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  }
}

export {ILogo};
