import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors, typography} from '@/Theme';
import {Button, CheckBox, TextInputCustom} from '@/Commons';
import {useAppDispatch, useKeyboardShown} from '@/Hooks';
import {TextInput} from 'react-native-gesture-handler';
import * as Yup from 'yup';
import {FormikHelpers, useFormik} from 'formik';
import {useSignupMutation} from '@/Services';
import {SignupRequest} from '@/Models';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackParamList} from '@/Navigators/Stacks';
import {ISignup} from './Signup';
import {setGuestMode} from '@/Store/auth';

const SignUp: React.FC<ISignup.IProps> = () => {
  const {t} = useTranslation();
  const {keyboardShown} = useKeyboardShown({platform: 'both'});
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [showPassAssist, setShowPassAssist] = useState(false);
  const navigation = useNavigation<NavigationProp<StackParamList, 'auth'>>();
  const dispatch = useAppDispatch();

  const [signup, {isSuccess, isLoading, error}] = useSignupMutation();

  const SignupValidationSchema = useMemo(
    () =>
      Yup.object().shape({
        firstName: Yup.string().required(t('field_mandatory')),
        lastName: Yup.string().required(t('field_mandatory')),
        email: Yup.string()
          .email(t('invalid_email'))
          .required(t('field_mandatory')),
        password: Yup.string()
          .required(t('field_mandatory'))
          .matches(/^(?=.{8,})/, t('pass_assist')),
      }),
    [t],
  );

  const performSignup = useCallback(
    (
      values: ISignup.FormState,
      formikHelpers: FormikHelpers<ISignup.FormState>,
    ) => {
      Keyboard.dismiss();
      if (!values.agree) {
        setTimeout(() => {
          formikHelpers.setErrors({agree: t('required')});
          formikHelpers.setSubmitting(false);
        }, 300);
        return;
      }
      signup({
        email: values.email.toLowerCase().trim(),
        password: values.password,
        password_confirmation: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        terms_conditions_agree: values.agree ? '1' : '0',
        marketing_agree: values.subscribe ? '1' : '0',
      });
    },
    [signup, t],
  );

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    setFieldValue,
    isValid,
    touched,
    setErrors,
  } = useFormik<ISignup.FormState>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      subscribe: false,
      agree: false,
    },
    onSubmit: performSignup,
    validationSchema: SignupValidationSchema,
  });

  useEffect(() => {
    if (error) {
      const err = error as any;
      if (err.data && err.data.errors) {
        const errs = err.data.errors as {
          [Property in keyof Pick<
            SignupRequest,
            'email' | 'first_name' | 'last_name' | 'password'
          >]: string[];
        };
        setErrors({
          email: errs.email ? errs.email[0] : '',
          password: errs.password ? errs.password[0] : '',
          firstName: errs.first_name ? errs.first_name[0] : '',
          lastName: errs.last_name ? errs.last_name[0] : '',
        });
      }
    }
  }, [error, setErrors]);

  const goToNextScreen = useCallback(() => {
    navigation.navigate('emailSent', {
      email: values.email,
      password: values.password,
    });
  }, [navigation, values.email, values.password]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        goToNextScreen();
      }, 1000);
    }
  }, [goToNextScreen, isSuccess]);

  const goToTermsAndPrivacy = useCallback(() => {
    navigation.navigate('about');
  }, [navigation]);

  const continueAsGuest = useCallback(() => {
    dispatch(setGuestMode(true));
    navigation.reset({
      routes: [{name: 'tabBar'}],
    });
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('sign_up')}</Text>
        <Text style={styles.description}>{t('sign_up_description')}</Text>
        <TextInputCustom
          value={values.firstName}
          label={t('first_name')}
          style={[styles.inputStyle, styles.firstName]}
          onChangeText={handleChange('firstName')}
          blurOnSubmit={false}
          hasError={!!errors.firstName && !!touched.firstName}
          onSubmitEditing={() => lastNameRef.current?.focus()}
          onBlur={handleBlur('firstName')}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
        {touched.firstName && errors.firstName && (
          <Text style={styles.error}>{errors.firstName}</Text>
        )}
        <TextInputCustom
          value={values.lastName}
          label={t('last_name')}
          style={styles.inputStyle}
          onChangeText={handleChange('lastName')}
          blurOnSubmit={false}
          hasError={!!errors.lastName && !!touched.lastName}
          onSubmitEditing={() => emailRef.current?.focus()}
          onBlur={handleBlur('lastName')}
          autoComplete="name-family"
          textContentType="familyName"
          returnKeyType="next"
          ref={lastNameRef}
        />
        {touched.lastName && errors.lastName && (
          <Text style={styles.error}>{errors.lastName}</Text>
        )}
        <TextInputCustom
          value={values.email}
          label={t('email')}
          style={styles.inputStyle}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          blurOnSubmit={false}
          hasError={!!errors.email && !!touched.email}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          ref={emailRef}
          autoCapitalize="none"
        />
        {touched.email && errors.email && (
          <Text style={styles.error}>{errors.email}</Text>
        )}
        <TextInputCustom
          value={values.password}
          label={t('password')}
          style={styles.inputStyle}
          isPassword={true}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          hasError={!!errors.password && !!touched.password}
          onSubmitEditing={() => handleSubmit()}
          returnKeyType="done"
          autoComplete="password"
          textContentType="newPassword"
          cursorColor={colors.primary}
          ref={passwordRef}
          isAssistive={showPassAssist && !values.password}
          onFocus={() => setShowPassAssist(true)}
        />
        {touched.password && errors.password && (
          <Text style={styles.error}>{errors.password}</Text>
        )}
        <CheckBox
          style={[styles.checkStyle, styles.firstCheck]}
          onPress={() => {
            setFieldValue('subscribe', !values.subscribe);
          }}
          title={t('subscribe_me_to_email')}
          type="circle"
          isActive={values.subscribe}
        />
        <CheckBox
          style={styles.checkStyle}
          onPress={() => {
            setFieldValue('agree', !values.agree);
          }}
          onPressLinear={goToTermsAndPrivacy}
          title={t('i_agree_to_the')}
          linearText={t('terms_and_privacy')}
          type="circle"
          isActive={values.agree}
          hasError={!!errors.agree}
        />
        {errors.agree && <Text style={styles.error}>{errors.agree}</Text>}
        {keyboardShown && (
          <View>
            <Button
              title={t('create_account')}
              style={styles.buttonCreate}
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
            title={t('create_account')}
            style={styles.buttonCreate}
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
  keyboardAvoiding: {
    flex: 1,
    borderWidth: 1,
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
  firstName: {
    marginTop: 24,
  },
  firstCheck: {
    marginTop: 24,
  },
  checkStyle: {
    marginTop: 8,
  },
  buttonCreate: {
    marginTop: 22,
    marginBottom: 8,
  },
  error: {
    ...typography.error,
    marginTop: 4,
  },
  assist: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 4,
  },
});

export default SignUp;
