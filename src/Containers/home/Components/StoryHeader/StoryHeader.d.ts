import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';

declare namespace IStoryHeader {
  interface IProps {
    navigation: StackNavigationProp<
      StackParamList,
      'storyDetails' | 'partnershipStoryDetails'
    >;
    rightButtonVariant?: 'share' | 'menu' | 'none';
    onRightButtonPress?: () => void;
  }
}

export {IStoryHeader};
