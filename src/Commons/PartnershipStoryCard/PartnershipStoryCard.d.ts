import {PartnershipStory} from '@/Models';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IPartnershipStoryCard {
  interface IProps {
    partnershipStory: PartnershipStory | null;
    isSkeleton?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    size?: 'small' | 'large';
    variant?: 'normal' | 'option' | 'checkbox';
  }
}

export {IPartnershipStoryCard};
