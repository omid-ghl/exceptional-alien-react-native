import {StyleProp, ViewStyle} from 'react-native';

declare namespace IVideoHeader {
  interface IProps {
    style?: StyleProp<ViewStyle>;
    onBackPress: () => void;
  }
}

export {IVideoHeader};
