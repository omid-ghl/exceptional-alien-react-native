import {StyleProp, ViewStyle} from 'react-native';

declare namespace ICheckBox {
  interface IProps {
    onPress: () => void;
    isActive?: boolean;
    title: string;
    type?: 'square' | 'circle';
    style?: StyleProp<ViewStyle>;
    onPressLinear?: () => void;
    linearText?: string;
    hasError?: boolean;
  }
}

export {ICheckBox};
