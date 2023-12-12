import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';

declare namespace ICard {
  interface IProps {
    isSkeleton?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    cardName?: string | string[];
    logoImage?: string;
    logoTitle?: string;
    backImage?: string;
    titleText?: string;
    caption?: string;
    size?: 'small' | 'large';
    variant?: 'normal' | 'options' | 'checkbox';
    showLogo?: boolean;
    logoImageStyle?: StyleProp<ImageStyle>;
    logoTitleStyle?: StyleProp<TextStyle>;
    categoryId?: number;
    isSelected?: boolean;
    onOptionsPress?: () => void;
  }
}

export {ICard};
