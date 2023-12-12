import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';

import {ICheckBox} from '@/Commons/CheckBox/CheckBox';
import {colors, SVG, typography} from '@/Theme';

const CheckBox = (props: ICheckBox.IProps) => {
  const {
    onPress,
    isActive,
    title,
    type = 'square',
    style,
    onPressLinear,
    linearText,
    hasError,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.buttonStyle, style]}>
      <>
        {type === 'square' &&
          (isActive ? <SVG.CheckboxFill /> : <SVG.CheckboxEmpty />)}
        {type === 'circle' &&
          (isActive ? (
            <SVG.CircleCheckFill />
          ) : hasError ? (
            <SVG.CircleCheckEmpty color={colors.errorColor} />
          ) : (
            <SVG.CircleCheckEmpty />
          ))}
        <Text style={styles.textStyle}>{title}</Text>
        <TouchableOpacity
          onPress={onPressLinear}
          activeOpacity={0.7}
          style={styles.lineButton}>
          <Text style={styles.linearText}>{linearText}</Text>
        </TouchableOpacity>
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    ...typography.caption,
    color: colors.gray100,
    marginLeft: 8,
  },
  lineButton: {
    marginLeft: 2,
  },
  linearText: {
    ...typography.link,
  },
});

export default CheckBox;
