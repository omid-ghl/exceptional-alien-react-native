import {ImageStyle, StyleProp, ViewStyle} from 'react-native';
import {LatLng} from 'react-native-maps';

declare namespace IMapImage {
  interface IProps {
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    onPress?: () => void;
    markers: (LatLng & {gemCategoryId?: number; filled?: boolean})[];
    mapWidth?: number;
    mapHeight?: number;
    zoom?: number;
  }
}

export {IMapImage};
