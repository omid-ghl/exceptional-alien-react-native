import {LatLng} from 'react-native-maps';
import MapView from 'react-native-maps';

declare namespace IMap {
  interface IProps extends React.ComponentProps<typeof MapView> {
    markers: (LatLng & {title?: string; description?: string})[];
    categoriesOfGems?: number[];
    filledIcons?: boolean;
  }
}

export {IMap};
