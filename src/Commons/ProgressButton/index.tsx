import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import * as Progress from 'react-native-progress';

import {IProgressButton} from '@/Commons/ProgressButton/ProgressButton';
import {colors, SVG} from '@/Theme';

const ProgressButton = (props: IProgressButton.IProps) => {
  const {onPress, style, percent = 0} = props;
  return (
    <View style={[styles.buttonContainer, style]}>
      <Progress.Circle
        progress={percent}
        size={96}
        unfilledColor={colors.white8}
        borderColor={'transparent'}
        color={colors.white}
      />
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={onPress}
        style={styles.buttonStyle}>
        <SVG.ArrowRight />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    height: 62,
    width: 62,
    borderRadius: 31,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
  },
});

export default ProgressButton;
