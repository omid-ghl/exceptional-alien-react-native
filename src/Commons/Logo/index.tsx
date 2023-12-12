import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {colors, fonts} from '@/Theme';
import {ILogo} from '@/Commons/Logo/Logo';
import {useTranslation} from 'react-i18next';

const Logo = (props: ILogo.IProps) => {
  const {fontSize, style, textStyle} = props;
  const {t} = useTranslation();
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.titleText, fontSize ? {fontSize} : {}, textStyle]} adjustsFontSizeToFit={true} numberOfLines={1}>
        {t('app_name')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    // justifyContent: 'center',
  },
  titleText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: 60,
    width: '80%',
    textAlign: 'center',
    // marginHorizontal: 30,
    // borderWidth: 1,
    // borderColor: 'white',
  },
});

export default Logo;
