import type {ViewStyle} from 'react-native';

declare namespace ILoadingTile {
  type IProps = {
    imageUrl: string | null;
    startAnimationFrom: 'top' | 'bottom';
    style?: ViewStyle;
    offsetX?: number;
  };
}

export {ILoadingTile};
