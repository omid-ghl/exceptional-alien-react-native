import React, {useEffect, useState} from 'react';
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
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useChangePasswordMutation} from '@/Services';

const ResetPassword: React.FC<
  StackScreenProps<StackParamList, 'resetPassword'>
> = ({navigation}) => {
  const {t} = useTranslation();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [passwordIsApproved, setPasswordIsApproved] = useState<boolean>(false);

  const isSame =
    newPassword.length > 1 &&
    confirmNewPassword.length > 1 &&
    newPassword === confirmNewPassword;

  const [changePassword, {isSuccess, isLoading}] = useChangePasswordMutation();

  const onApprovePassword = () => {
    changePassword({
      password: newPassword,
      current_password: currentPassword,
      password_confirmation: confirmNewPassword,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setPasswordIsApproved(true);
    }
  }, [isSuccess]);

  const renderApproveContent = passwordIsApproved && (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <SVG.Close
          style={styles.closeBtn}
          width={20}
          height={20}
          stroke={colors.black}
        />
      </TouchableOpacity>
      <Image style={styles.icon} source={images.check} />
      <Text style={styles.resetPassword}>{t('password_reseted')}</Text>
      <Text style={styles.usePassword}>{t('use_password')}</Text>
      <TouchableOpacity>
        <Text style={styles.wasntYou}>{t('wasnt_you')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPasswordContent = !passwordIsApproved && (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>{t('reset_password')}</Text>
        <Text style={styles.headerDesc}>{t('new_pass_alert')}</Text>
      </View>
      <View>
        <TextInputCustom
          label={t('current_password')}
          isPassword={true}
          returnKeyType="done"
          autoComplete="password"
          cursorColor={colors.primary}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          style={styles.input}
        />
        <TextInputCustom
          label={t('new_password')}
          isPassword={true}
          returnKeyType="done"
          autoComplete="password"
          cursorColor={colors.primary}
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
        <TextInputCustom
          label={t('confirm_new_password')}
          isPassword={true}
          returnKeyType="done"
          autoComplete="password"
          cursorColor={colors.primary}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          style={styles.input}
        />
      </View>
      <Button
        isLoading={isLoading}
        disable={currentPassword.length > 1 && !isSame}
        style={styles.resetBtn}
        onPress={onApprovePassword}
        title="Reset password"
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderPasswordContent}
          {renderApproveContent}
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
    marginTop: 10,
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
  resetBtn: {
    marginTop: 230,
    marginBottom: 40,
  },
  icon: {
    width: 46,
    height: 46,
    marginTop: 212,
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  resetPassword: {
    ...typography.h1,
    width: 300,
    marginTop: 19,
  },
  usePassword: {
    ...typography.h4,
    marginTop: 10,
    color: colors.gray100,
  },
  wasntYou: {
    ...typography.link,
    marginTop: 56,
  },
  input: {
    marginTop: 12,
  },
});

export default ResetPassword;
