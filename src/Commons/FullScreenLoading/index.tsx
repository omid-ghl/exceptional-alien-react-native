import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';

import {colors, fonts} from '@/Theme';
import {useTranslation} from 'react-i18next';

const FullScreenLoading = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.black} />
      <Text style={styles.text}>{t('loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: 16,
    marginTop: 16,
  },
});

export default FullScreenLoading;
