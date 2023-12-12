import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomSlider from 'react-native-slider-custom';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/Theme';
import {IVideoSlider} from './VideoSlider';

const VideoSlider: React.FC<IVideoSlider.IProps> = ({
  maximumColor,
  ...props
}) => {
  return (
    <CustomSlider
      customMinimumTrack={
        <LinearGradient
          colors={['#ABCDFF', colors.primary]}
          angle={90}
          useAngle={true}
          angleCenter={{x: 0.5, y: 0.5}}
          style={styles.minimum}
        />
      }
      customMaximumTrack={
        <LinearGradient
          angle={136}
          colors={[
            maximumColor ?? colors.gray30,
            maximumColor ?? colors.gray30,
          ]}
          useAngle={true}
          angleCenter={{x: 0.5, y: 0.5}}
          style={styles.maximum}
        />
      }
      customThumb={<View />}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  maximum: {
    width: '100%',
    height: 8,
    transform: [{translateY: -2}],
    borderRadius: 3,
  },
  minimum: {
    width: '100%',
    height: 8,
    transform: [{translateY: -2}],
    borderRadius: 3,
  },
});

export default VideoSlider;
