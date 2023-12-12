import {Gem} from '@/Models/Gem';
import {StackParamList} from '@/Navigators/Stacks';
import {StackNavigationProp} from '@react-navigation/stack';
import {RefObject} from 'react';
import {Modalize} from 'react-native-modalize';

declare namespace IGemActionModal {
  interface IProps {
    gemActionModalRef: RefObject<Modalize>;
    data: Gem;
    navigation: StackNavigationProp<StackParamList, any>;
    removable?: boolean;
    isInMyPlaybook?: boolean;
    myPlaybookId?: number;
  }
}

export {IGemActionModal};
