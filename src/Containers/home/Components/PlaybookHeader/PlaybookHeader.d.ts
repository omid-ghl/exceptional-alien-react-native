import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';
declare namespace IPlaybookHeader {
  interface IProps {
    navigation: StackNavigationProp<StackParamList, 'playBookDetails'>;
    rightButtonVariant?: 'share' | 'menu' | 'none' | 'loading';
    onRightButtonPress?: () => void;
    collectedStatus?: boolean;
  }
}

export {IPlaybookHeader};
