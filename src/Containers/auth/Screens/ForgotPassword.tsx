import {Button, TextInputCustom} from '@/Commons';
import {ForgotPasswordRequest} from '@/Models';
import {StackParamList} from '@/Navigators/Stacks';
import {useForgotPasswordMutation} from '@/Services';
import {colors, typography} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import {FormikHelpers, useFormik} from 'formik';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Yup from 'yup';

type FormState = {
  email: string;
};

const ForgotPassword: React.FC<
  StackScreenProps<StackParamList, 'forgotPassword'>
> = ({navigation}) => {
  const {t} = useTranslation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: () => null,
    });
  }, [navigation]);

  const [forgotPassword, {isSuccess, isLoading, error}] =
    useForgotPasswordMutation();

  const ForgotPasswordValidationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email(t('invalid_email'))
          .required(t('field_mandatory')),
      }),
    [t],
  );

  const sendForgotPassword = useCallback(
    (values: FormState, _formikHelpers: FormikHelpers<FormState>) => {
      Keyboard.dismiss();
      forgotPassword({
        email: values.email,
      });
    },
    [forgotPassword],
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
  } = useFormik<FormState>({
    initialValues: {
      email: '',
    },
    onSubmit: sendForgotPassword,
    validationSchema: ForgotPasswordValidationSchema,
  });

  useEffect(() => {
    if (error) {
      const err = error as any;
      if (err.data && err.data.errors) {
        const errs = err.data.errors as {
          [Property in keyof ForgotPasswordRequest]: string[];
        };
        setErrors({
          email: errs.email ? errs.email[0] : 'An error occured',
        });
      }
    }
  }, [error, setErrors]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigation.navigate('forgotPasswordLinkSent', {email: values.email});
      }, 1000);
    }
  }, [isSuccess, navigation, values.email]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.top} />
            <View style={styles.content}>
              <Text style={typography.h1}>{t('forgot_password')}</Text>
              <Text style={styles.description}>
                {t('forgot_password_description')}
              </Text>
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
                returnKeyType="done"
                onSubmitEditing={handleSubmit as () => void}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={t('submit')}
                style={styles.button}
                onPress={handleSubmit}
                disable={!isValid}
                isLoading={isLoading}
                isSuccess={isSuccess}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'android' ? 36 : 12,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  top: {
    flex: 1,
  },
  content: {
    flex: 4,
    paddingHorizontal: 16,
  },
  description: {
    ...typography.h5,
    color: colors.gray100,
    marginTop: 16,
  },
  inputStyle: {
    marginTop: 32,
  },
  error: {
    ...typography.error,
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 22,
    marginBottom: 8,
  },
});

export default ForgotPassword;
