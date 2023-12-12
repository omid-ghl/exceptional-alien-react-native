import {Story} from '@/Models';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IStoryCard {
  interface IProps {
    story: Story | null;
    isSkeleton?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    size?: 'small' | 'large';
    variant?: 'normal' | 'option' | 'checkbox';
  }
}

export {IStoryCard};
