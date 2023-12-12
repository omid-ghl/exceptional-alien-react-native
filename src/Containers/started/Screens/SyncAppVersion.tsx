import React from 'react';
import {View, StyleSheet, Text, Image, Platform} from 'react-native';

import {StackParamList} from '@/Navigators/Stacks';
import {StackScreenProps} from '@react-navigation/stack';
import {Button} from '@/Commons';
import {colors, images, typography, variables} from '@/Theme';
import {useTranslation} from 'react-i18next';

const SyncAppVersion: React.FC<
  StackScreenProps<StackParamList, 'syncAppVersion'>
> = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <View style={{marginTop: variables.dimensions.height * 0.3}}>
          <Image source={images.cloud} style={styles.icon} />
          <Text style={styles.title}>{t('update_required')}</Text>
          <Text style={styles.description}>
            {t('update_required_des', {
              store: Platform.OS === 'ios' ? 'App Store' : 'Play Store',
            })}
          </Text>
        </View>
        <Button
          onPress={() => {}}
          style={styles.button}
          title={t('open', {
            store: Platform.OS === 'ios' ? 'App Store' : 'Play Store',
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerWrapper: {
    marginBottom: 48,
  },
  headerTitle: {
    ...typography.h1,
    marginTop: 48,
  },
  headerDesc: {
    ...typography.h5,
    marginTop: 16,
    color: colors.gray100,
  },
  closeBtn: {alignSelf: 'flex-end'},
  inputStyle: {
    marginTop: 48,
  },
  icon: {width: 47, height: 49},
  title: {
    ...typography.h1,
    marginTop: 17,
    width: 250,
  },
  description: {
    ...typography.h4,
    marginTop: 10,
    color: colors.gray100,
  },
  button: {position: 'absolute', bottom: 40},
  touchStyle: {
    ...typography.h4,
    marginTop: 15,
    alignSelf: 'center',
  },
  deleteBtn: {
    marginTop: 400,
  },
});

export default SyncAppVersion;
