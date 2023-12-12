import {PlayBook} from '@/Models/PlayBook';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IPlayBookContent {
  interface IProps {
    playBook: PlayBook;
    style?: StyleProp<ViewStyle>;
  }
}

export {IPlayBookContent};
