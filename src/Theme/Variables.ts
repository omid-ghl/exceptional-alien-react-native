import {Dimensions, Platform} from 'react-native';
import deviceInfoModule from 'react-native-device-info';

export const dimensions = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
};

export const hasNotch = Platform.OS === 'ios' && deviceInfoModule.hasNotch();

export const fontSize = {
  small: 16,
  regular: 20,
  large: 40,
};

const tiny = 5;
const small = tiny * 2; // 10
const regular = tiny * 3; // 15
const large = regular * 2; // 30
export const metricsSizes = {
  tiny,
  small,
  regular,
  large,
};

export default {
  dimensions,
  fontSize,
  metricsSizes,
  hasNotch,
};
