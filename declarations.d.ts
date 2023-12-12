declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-slider-custom' {
  import type Slider from '@react-native-community/slider';
  import React, {ReactNode} from 'react';
  type Props = React.ComponentProps<typeof Slider> & {
    customMinimumTrack?: ReactNode;
    customMaximumTrack?: ReactNode;
    customThumb?: ReactNode;
  };
  const content: React.FC<Props>;
  export default content;
}
