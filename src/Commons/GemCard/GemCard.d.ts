import {Gem} from '@/Models';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IGemCard {
  interface IProps {
    gem: Gem | null;
    isSkeleton?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    size?: 'small' | 'large';
    variant?: 'normal' | 'options' | 'checkbox';
    isSelected?: boolean;
    onOptionsPress?: () => void;
  }
}

export {IGemCard};
