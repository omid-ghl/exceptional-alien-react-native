import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {colors, typography} from '@/Theme';
import {ILink} from './Link';

const Link = (props: ILink.IProps) => {
  const {onPress, text, type, style, disable, textStyle} = props;
  return (
    <TouchableOpacity
      disabled={disable}
      activeOpacity={disable ? 1 : 0.5}
      onPress={onPress}
      style={[
        styles.touchable,
        type === 'secondary' && {backgroundColor: colors.white},
        style,
      ]}>
      <Text
        style={[
          styles.text,
          type === 'secondary' && {color: colors.black},
          textStyle,
          disable && {
            color: colors.gray100,
            textDecorationColor: colors.gray100,
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  text: {
    ...typography.link,
    color: colors.black,
    textDecorationColor: 'black',
  },
});

export default Link;
