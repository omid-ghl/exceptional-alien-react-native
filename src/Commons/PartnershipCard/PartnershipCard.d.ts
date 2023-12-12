import {Partnership} from '@/Models';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IPartnershipCard {
  interface IProps {
    partnership: Partnership | null;
    isSkeleton?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    size?: 'small' | 'large';
    variant?: 'normal' | 'option' | 'checkbox';
  }
}

export {IPartnershipCard};
