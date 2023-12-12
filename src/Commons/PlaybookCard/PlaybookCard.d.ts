import {PlayBook} from '@/Models/PlayBook';
import {StyleProp, ViewStyle} from 'react-native';

declare namespace IPlaybookCard {
  interface IProps {
    playbook: PlayBook | null;
    isSkeleton?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    size?: 'small' | 'large';
    variant?: 'normal' | 'option' | 'checkbox';
  }
}

export {IPlaybookCard};
