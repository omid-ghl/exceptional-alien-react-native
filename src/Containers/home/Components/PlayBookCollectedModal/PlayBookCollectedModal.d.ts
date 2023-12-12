import {RefObject} from 'react';
import {Modalize} from 'react-native-modalize';

declare namespace IPlayBookCollectedModal {
  interface IProps {
    collectedModalRef: RefObject<Modalize>;
  }
}

export {IPlayBookCollectedModal};
