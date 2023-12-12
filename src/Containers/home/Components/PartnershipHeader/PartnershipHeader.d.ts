import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';
declare namespace IPartnershipHeader {
  interface IProps {
    navigation: StackNavigationProp<StackParamList, 'partnershipDetails'>;
    rightButtonVariant?: 'share' | 'none';
    onRightButtonPress?: () => void;
  }
}

export {IPartnershipHeader};
