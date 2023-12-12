import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';

declare namespace IGemHeader {
  interface IProps {
    navigation: StackNavigationProp<StackParamList, 'gemDetails'>;
    rightButtonVariant?: 'share' | 'menu' | 'loading' | 'none';
    onRightButtonPress?: () => void;
  }
}

export {IGemHeader};
