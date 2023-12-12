import {Gem} from '@/Models/Gem';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IGemContent {
  interface IProps {
    gem: Gem;
    style?: StyleProp<ViewStyle>;
  }
}

export {IGemContent};
