import {RefObject} from 'react';
import {Modalize} from 'react-native-modalize';

declare namespace IGemCollectedModal {
  interface IProps {
    collectGemModalRef: RefObject<Modalize>;
    playbookModalRef: RefObject<Modalize>;
  }
}

export {IGemCollectedModal};
