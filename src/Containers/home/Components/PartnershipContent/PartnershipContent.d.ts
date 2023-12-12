import {Partnership} from '@/Models';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IPartnershipContent {
  interface IProps {
    partnership: Partnership;
    style?: StyleProp<ViewStyle>;
  }
}

export {IPartnershipContent};
