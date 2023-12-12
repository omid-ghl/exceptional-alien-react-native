import {StyleProp, TextStyle, ViewStyle} from 'react-native';

declare namespace ILink {
  interface IProps {
    onPress: () => void;
    text: string;
    type?: 'primary' | 'secondary';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disable?: boolean;
  }
}

export {ILink};
