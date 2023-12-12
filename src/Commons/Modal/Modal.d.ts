import React, {RefObject} from 'react';
import {Modalize} from 'react-native-modalize';

declare namespace IModal {
  interface IProps extends React.ComponentProps<typeof Modalize> {
    children: JSX.Element;
    customRef: RefObject<{}>;
    snapPoint?: number;
    adjustToContentHeight?: boolean;
    snapPoint?: number;
    panGestureComponentEnabled?: boolean;
    panGestureEnabled?: boolean;
    withReactModal?: boolean;
    isFlatList?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
  }
}

export {IModal};
