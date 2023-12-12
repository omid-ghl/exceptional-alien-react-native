import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors, typography} from '@/Theme';
import {Button, Link, TextInputCustom} from '@/Commons';
import {useAppDispatch, useAppSelector, useKeyboardShown} from '@/Hooks';
import {TokenStorage, useLoginMutation} from '@/Services';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList} from '@/Navigators/Stacks';
import {ILogin} from './Login';
import {setGuestMode} from '@/Store/auth';

const Login: React.FC<ILogin.IProps> = () => {
  const {t} = useTranslation();
  const {keyboardShown} = useKeyboardShown({platform: 'both'});
  const passwordRef = useRef<TextInput>(null);
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'forgotPassword'>>();

  const dispatch = useAppDispatch();
  const isOnboarded = useAppSelector(state => state.auth.user?.is_onboarded);
  const guestMode = useAppSelector(state => state.auth.guest.guestMode);
  const guestIntendedNavigationState = useAppSelector(
    state => state.navigation.guestIntendedNavigationState,
  );

  const [login, {data, isSuccess, isLoading, error}] = useLoginMutation();

  const LoginValidationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email(t('invalid_email'))
          .required(t('field_mandatory')),
        password: Yup.string().required(t('field_mandatory')),
      }),
    [t],
  );

  const performLogin = useCallback(
    (values: ILogin.FormState) => {
      Keyboard.dismiss();
      login({
        email: values.email.trim(),
        password: values.password.trim(),
        device_name: 'ea-app',
      });
    },
    [login],
  );

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isValid,
    touched,
    setErrors,
  } = useFormik<ILogin.FormState>({
    initialValues: {
      // email: 'michael@presentcompany.co',
      // password: '!Bl1tzkr1eg#',
      email: '',
      password: '',
    },
    onSubmit: performLogin,
    validationSchema: LoginValidationSchema,
  });

  useEffect(() => {
    if (error) {
      const errorObj = error as any;
      if (
        errorObj.data &&
        errorObj.data.errors &&
        errorObj.data.errors.data &&
        errorObj.data.errors.data[0]
      ) {
        const errorStr = errorObj.data.errors.data[0];
        setErrors({email: errorStr, password: errorStr});
      }
    }
  }, [error, setErrors]);

  const goToNextScreen = useCallback(() => {
    if (isOnboarded || isOnboarded === null) {
      console.log(
        'guestMode',
        guestMode,
        'guestIntendedNavigationState',
        guestIntendedNavigationState,
      );
      if (guestMode) {
        dispatch(setGuestMode(false));
        if (guestIntendedNavigationState) {
          navigation.reset(guestIntendedNavigationState);
        }
        return;
      } else {
        navigation.reset({
          routes: [
            {
              name: 'splash',
              params: {
                hasLoading: true,
              },
            },
          ],
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

  const continueAsGuest = useCallback(() => {
    dispatch(setGuestMode(true));
    navigation.reset({
      routes: [{name: 'tabBar'}],
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (isSuccess && data && data.token && data.user) {
      TokenStorage.setToken(data.token)
        .then(() => {
          setTimeout(() => {
            goToNextScreen();
          }, 1000);
        })
        .catch(() => {});
    }
  }, [isSuccess, data, dispatch, goToNextScreen]);

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('log_in')}</Text>
        <Text style={styles.description}>{t('login_description')}</Text>
        <TextInputCustom
          value={values.email}
          label={t('email')}
          style={[styles.inputStyle, styles.email]}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          blurOnSubmit={false}
          hasError={!!errors.email && !!touched.email}
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        {touched.email && errors.email && (
          <Text style={styles.error}>{errors.email}</Text>
        )}
        <TextInputCustom
          value={values.password}
          label={t('password')}
          style={[styles.inputStyle, styles.pass]}
          isPassword={true}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          hasError={!!errors.password && !!touched.password}
          onSubmitEditing={() => handleSubmit()}
          returnKeyType="done"
          autoComplete="password"
          cursorColor={colors.primary}
          ref={passwordRef}
          textContentType="password"
        />
        {touched.password && errors.password && (
          <Text style={styles.error}>{errors.password}</Text>
        )}
        <Link
          text={t('forgot_your_password')}
          onPress={() => {
            navigation.navigate('forgotPassword');
          }}
          style={styles.forgot}
        />
        {keyboardShown && (
          <View>
            <Button
              title={t('log_in')}
              style={styles.buttonSignIn}
              onPress={handleSubmit}
              disable={!isValid}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
            <Button
              title={t('continue_as_guest')}
              type={'secondary'}
              onPress={continueAsGuest}
            />
          </View>
        )}
      </ScrollView>
      {!keyboardShown && (
        <View>
          <Button
            title={t('log_in')}
            style={styles.buttonSignIn}
            onPress={handleSubmit}
            disable={!isValid}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
          <Button
            title={t('continue_as_guest')}
            type={'secondary'}
            onPress={continueAsGuest}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: Platform.OS === 'android' ? 36 : 12,
  },
  title: {
    ...typography.h1,
    marginTop: 16,
  },
  description: {
    ...typography.h5,
    color: colors.gray100,
    marginTop: 16,
  },
  inputStyle: {
    marginTop: 16,
  },
  email: {
    marginTop: 24,
  },
  pass: {},
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
    paddingRight: 0,
    paddingVertical: 8,
  },
  spacer: {
    flex: 1,
  },
  buttonSignIn: {
    marginTop: 22,
    marginBottom: 8,
  },
  error: {
    ...typography.error,
    marginTop: 4,
  },
});

export default Login;
