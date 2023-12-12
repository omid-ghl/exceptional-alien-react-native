import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, images, SVG, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {Button, TextInputCustom} from '@/Commons';

const DeleteAccount: React.FC<
  StackScreenProps<StackParamList, 'deleteAccount'>
> = ({navigation}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {true && (
            <>
              <View style={styles.headerWrapper}>
                <Text style={styles.headerTitle}>
                  {t('delete_your_account')}
                </Text>
                <Text style={styles.headerDesc}>
                  {t('delete_account_header')}
                </Text>
              </View>
              <View>
                <Button
                  style={styles.deleteBtn}
                  onPress={() => {}}
                  title="Delete"
                />
              </View>
            </>
          )}
          {false && (
            <View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => navigation.goBack()}>
                <SVG.Close width={20} height={20} stroke={colors.black} />
              </TouchableOpacity>
              <View>
                <Image source={images.cloud} style={styles.icon} />
                <Text style={styles.title}>{t('sorry_to_see')}</Text>
                <Text style={styles.description}>{t('account_deleted')}</Text>
                <TextInputCustom
                  label={t('email')}
                  style={styles.inputStyle}
                  returnKeyType="done"
                  autoComplete="email"
                  cursorColor={colors.primary}
                />
                <Button
                  style={styles.button}
                  onPress={() => navigation.navigate('signup')}
                  title="Sign up"
                />
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.touchStyle}>{t('no_thanks')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
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
  icon: {width: 47, height: 49, marginTop: 153},
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
  button: {marginTop: 161},
  touchStyle: {
    ...typography.h4,
    marginTop: 15,
    alignSelf: 'center',
  },
  deleteBtn: {
    marginTop: 400,
  },
});

export default DeleteAccount;
