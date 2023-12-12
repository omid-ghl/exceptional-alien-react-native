import {Link} from '@/Commons';
import {useAppDispatch, useAppSelector} from '@/Hooks';
import {StackParamList} from '@/Navigators/Stacks';
import {useLoginMutation, useResendEmailMutation} from '@/Services';
import {colors, SVG, typography} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {TokenStorage} from '@/Services';
import {setGuestMode} from '@/Store/auth';

const EmailSent: React.FC<StackScreenProps<StackParamList, 'emailSent'>> = ({
  navigation,
  route: {
    params: {email, password},
  },
}) => {
  const {t} = useTranslation();
  const [
    login,
    {
      isSuccess: loginIsSuccess,
      isError: loginIsError,
      isUninitialized: loginIsUnitialized,
      isLoading: loginIsLoading,
      data: loginData,
    },
  ] = useLoginMutation();

  const [
    resendEmail,
    {
      isSuccess: resendIsSuccess,
      isLoading: resendIsLoading,
      error: resendError,
    },
  ] = useResendEmailMutation();

  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isOnboarded = useAppSelector(state => state.auth.user?.is_onboarded);
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);
  const guestIntendedNavigationState = useAppSelector(
    state => state.navigation.guestIntendedNavigationState,
  );
  const dispatch = useAppDispatch();

  const goToNextScreen = useCallback(() => {
    if (isOnboarded || isOnboarded === null) {
      if (guestMode && guestIntendedNavigationState) {
        dispatch(setGuestMode(false));
        navigation.reset(guestIntendedNavigationState);
        return;
      } else {
        navigation.reset({
          routes: [{name: 'tabBar'}],
          index: 0,
        });
      }
    } else {
      navigation.reset({
        routes: [{name: 'selectLocations'}],
      });
    }
  }, [
    isOnboarded,
    guestMode,
    guestIntendedNavigationState,
    dispatch,
    navigation,
  ]);

  useEffect(() => {
    if (loginIsLoading || loginIsSuccess) {
      return;
    }
    if (loginIsUnitialized || loginIsError) {
      timeout.current = setTimeout(() => {
        login({
          email: email,
          password: password,
          device_name: 'ea-app',
        });
      }, 10000);
    }
  }, [
    email,
    loginIsError,
    loginIsLoading,
    loginIsSuccess,
    loginIsUnitialized,
    login,
    password,
  ]);

  useEffect(() => {
    if (!loginIsSuccess || !loginData?.token) {
      return;
    }
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    TokenStorage.setToken(loginData.token).then(() => {
      goToNextScreen();
    });
  }, [loginIsSuccess, loginData, navigation, goToNextScreen]);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    resendError &&
      console.log('resendError', JSON.stringify(resendError, null, 2));
  }, [resendError]);

  return (
    <View style={styles.container}>
      <SVG.EmailSent style={styles.icon} />
      <Text style={styles.title}>{t('verify_your_account')}</Text>
      <Text style={styles.description}>{t('verification_email_sent')}</Text>
      <View style={styles.linkContainer}>
        <Link
          onPress={() => {
            resendEmail({
              email: email,
            });
          }}
          text={t('didnt_get_email')}
          style={styles.link}
          textStyle={styles.linkText}
          disable={resendIsLoading}
        />
        {resendIsLoading && (
          <ActivityIndicator
            color={colors.primary}
            size="small"
            style={styles.loading}
          />
        )}
        {resendIsSuccess && <SVG.Tick color={colors.primary} />}
      </View>
      <Text style={typography.error}>
        {(resendError as any)?.data?.message}
      </Text>
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

export default EmailSent;
