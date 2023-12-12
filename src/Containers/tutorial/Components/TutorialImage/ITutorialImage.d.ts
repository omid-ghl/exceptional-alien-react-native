import {ImageSourcePropType} from 'react-native';

declare namespace ITutorialImage {
  type IProps = {
    fadeFromTop: boolean;
    image: ImageSourcePropType;
    animationDuration: number;
  };
}

export {ITutorialImage};
