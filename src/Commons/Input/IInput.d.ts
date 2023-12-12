import {ViewStyle} from 'react-native';

declare namespace IInput {
  type IProps = {
    onKeyUp?: () => void;
    onChangeText?: () => void;
    placeholder?: string;
    value?: string;
    style?: ViewStyle;
  };
}

export {IInput};
