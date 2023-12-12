import React, {FC, RefObject} from 'react';
import {ListRenderItem, RefreshControlProps, ViewStyle} from 'react-native';

declare namespace IDynamicFlatlist {
  interface IProps {
    isLoading: boolean;
    isFetching: boolean;
    onMomentumScrollEnd?: void = () => {};
    onEndReached?: any;
    data: Array<any>;
    keyExtractor?: any;
    ListEmptyComponent?: FC;
    renderItem: ListRenderItem<any>;
    pageCallBack?: (number: number) => void;
    swipable?: boolean;
    ListFooterComponent?: any;
    style?: ViewStyle;
    stickyItems?: object[];
    stickyHeaderIndices?: Array<number>;
    refreshControl?: React.ReactElement<
      RefreshControlProps,
      string | React.JSXElementConstructor<any>
    >;
    dataKey?: string[] | string;
    ListHeaderComponent?: React.JSXElementConstructor;
    onScroll?: NativeSyntheticEvent<NativeScrollEvent>;
    contentContainerStyle?: ViewStyle;
    ref?: RefObject;
    dataCallback?: (data: any[]) => void;
    getItemLayout?: any;
    extraData?: any;
    pagination?: number;
    hasEnded?: boolean;
  }
}

export {IDynamicFlatlist};
