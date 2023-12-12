import {Link} from '@/Commons';
import {ForgotPasswordRequest} from '@/Models';
import {StackParamList} from '@/Navigators/Stacks';
import {useForgotPasswordMutation} from '@/Services';
import {colors, SVG, typography} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const ForgotPasswordLinkSent: React.FC<
  StackScreenProps<StackParamList, 'forgotPasswordLinkSent'>
> = ({
  route: {
    params: {email},
  },
}) => {
  const {t} = useTranslation();
  const [forgotPassword, {isSuccess, isLoading, error}] =
    useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const sendForgotPassword = useCallback(() => {
    forgotPassword({
      email,
    });
  }, [email, forgotPassword]);

  useEffect(() => {
    if (error) {
      const err = error as any;
      if (err.data && err.data.errors) {
        const errs = err.data.errors as {
          [Property in keyof ForgotPasswordRequest]: string[];
        };
        setErrorMessage(errs.email ? errs.email[0] : 'An error occured');
      }
    }
  }, [error, setErrorMessage]);

  useEffect(() => {
    if (isSuccess) {
      setErrorMessage('');
    }
  }, [isSuccess]);

  return (
    <View style={styles.container}>
      <SVG.EmailVerified style={styles.icon} />
      <Text style={styles.title}>{t('link_sent')}</Text>
      <Text style={styles.description}>
        {t('reset_password_link_sent_description')}
      </Text>
      <View style={styles.linkContainer}>
        <Link
          onPress={sendForgotPassword}
          text={t('didnt_get_email')}
          style={styles.link}
          textStyle={styles.linkText}
          disable={isLoading}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loading}
          />
        )}
        {isSuccess && <SVG.Tick color={colors.primary} />}
      </View>
      <Text style={typography.error}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  closeContainer: {
    padding: 4,
    marginRight: 16,
  },
  icon: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  title: {
    ...typography.h1,
    marginTop: 26,
  },
  description: {
    ...typography.h4,
    color: colors.gray100,
    marginTop: 10,
  },
  link: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  linkText: {
    color: colors.primary,
  },
  linkContainer: {
    marginTop: 56,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  loading: {
    marginLeft: 8,
  },
});

export default ForgotPasswordLinkSent;
