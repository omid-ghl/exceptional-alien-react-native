/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {View} from 'react-native';

import {ISkeleton} from './Skeleton';

const TextSkeleton: React.FC<ISkeleton.IProps> = ({
  width,
  height,
  color,
  direction = 'row',
  count = 1,
  style,
}) => {
  const generatedArray = new Array(count).fill(0);

  return (
    <View style={{flexDirection: direction}}>
      {generatedArray.map((_, i) => (
        <View
          style={[
            {
              width,
              height,
              backgroundColor: color,
              borderRadius: 5,
            },
            style,
          ]}
          key={i}
        />
      ))}
    </View>
  );
};

export {TextSkeleton};
