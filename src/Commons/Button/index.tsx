import React from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {IButton} from '@/Commons/Button/Button';
import {colors, SVG, typography} from '@/Theme';

const Button = (props: IButton.IProps) => {
  const {
    onPress,
    title,
    type,
    style,
    isLoading,
    disable,
    isSuccess,
    textStyle,
  } = props;
  return (
    <TouchableOpacity
      disabled={disable || isLoading}
      activeOpacity={disable || isLoading ? 1 : 0.7}
      onPress={onPress}
      style={[
        styles.buttonStyle,
        type === 'secondary' && {backgroundColor: colors.white},
        disable && {backgroundColor: colors.gray30},
        style,
      ]}>
      {isSuccess ? (
        <SVG.Tick />
      ) : isLoading ? (
        <ActivityIndicator
          color={type === 'secondary' ? colors.primary : colors.white}
          size={'small'}
        />
      ) : (
        <Text
          style={[
            typography.h4,
            styles.textStyle,
            type === 'secondary' && {color: colors.black},
            disable && {color: colors.gray50},
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 50,
    width: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  textStyle: {
    color: colors.white,
  },
});

export default Button;
