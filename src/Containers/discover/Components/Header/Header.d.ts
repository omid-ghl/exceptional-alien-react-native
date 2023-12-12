import {Location} from '@/Models';
import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';

declare namespace IDiscoverHeader {
  type IProps = {
    location?: Location;
    isLoading?: boolean;
    navigation: StackNavigationProp<StackParamList>;
  };
}

export {IDiscoverHeader};
