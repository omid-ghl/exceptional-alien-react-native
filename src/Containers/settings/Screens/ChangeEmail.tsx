import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {Button, TextInputCustom} from '@/Commons';
import {useAppDispatch, useAppSelector, useKeyboardShown} from '@/Hooks';
import {useEditProfileMutation} from '@/Services';
import {IChangeEmail} from './IChangeEmail';
import {useFormik} from 'formik';
import {setUser} from '@/Store/auth';
import {User} from '@/Models';
import * as Yup from 'yup';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ChangeEmail: React.FC<
  StackScreenProps<StackParamList, 'changeEmail'>
> = ({navigation}) => {
  const {t} = useTranslation();

  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const {keyboardShown} = useKeyboardShown({platform: 'both'});
  const {bottom: bottomInset} = useSafeAreaInsets();

  const [currentEmail, setCurrentEmail] = useState(user?.email);

  // const userEmailIsVerified = user?.email_verified_at ? true : false;

  // const [
  //   resendEmail,
  //   {
  //     isSuccess: resendIsSuccess,
  //     isLoading: resendIsLoading,
  //     error: resendError,
  //   },
  // ] = useResendEmailMutation();

  const ValidationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email(t('invalid_email'))
          .required(t('field_mandatory')),
      }),
    [t],
  );

  const [editProfile, {isSuccess, isLoading, data: userData, error}] =
    useEditProfileMutation();

  const performEdit = useCallback(
    (values: IChangeEmail.FormState) => {
      Keyboard.dismiss();
      editProfile({
        email: values.email,
      });
    },
    [editProfile],
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
  } = useFormik<IChangeEmail.FormState>({
    initialValues: {
      email: '',
    },
    onSubmit: performEdit,
    validationSchema: ValidationSchema,
  });

  useEffect(() => {
    if (isSuccess && userData?.data) {
      dispatch(setUser(userData.data as User));
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [dispatch, isSuccess, navigation, userData?.data]);

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
        setErrors({email: errorStr});
      }
    }
  }, [error, setErrors]);

  // useEffect(() => {
  //   if (!userEmailIsVerified) {
  //     resendEmail({
  //       email: user?.email,
  //     });
  //   }
  // }, [resendEmail, user?.email, userEmailIsVerified]);

  const renderContainer = true && (
    <View style={styles.verifiedStyle}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>{t('change_email')}</Text>
        <Text style={styles.updatemail}>{t('update_email')}</Text>
      </View>
      <TextInputCustom
        value={currentEmail}
        onChangeText={setCurrentEmail}
        label={t('current_email')}
        style={[styles.inputStyle, styles.email]}
        blurOnSubmit={false}
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
        editable={false}
      />
      <TextInputCustom
        value={values.email}
        onChangeText={handleChange('email')}
        label={t('new_email')}
        style={[styles.inputStyle]}
        blurOnSubmit={false}
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="done"
        onBlur={handleBlur('email')}
        hasError={!!errors.email && !!touched.email}
        onSubmitEditing={() => handleSubmit()}
        autoCapitalize="none"
        textContentType="emailAddress"
      />
      {touched.email && errors.email && (
        <Text style={styles.error}>{errors.email}</Text>
      )}
      {/* {keyboardShown && (
        <Button
          style={styles.buttonStyle}
          onPress={handleSubmit}
          title={t('save')}
          disable={!isValid}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      )} */}
    </View>
  );

  // const renderVerifyingContainer = false && (
  //   <View style={styles.notVerified}>
  //     <TouchableOpacity
  //       style={styles.closeBtn}
  //       onPress={() => navigation.goBack()}>
  //       <SVG.Close width={20} height={20} stroke={colors.black} />
  //     </TouchableOpacity>
  //     <View style={styles.notVerifiedContainer}>
  //       <View style={styles.imageWrapper}>
  //         <Image source={images.Email} style={styles.imageStyle} />
  //       </View>
  //       <Text style={styles.emailNotVerified}>{t('verify_email')}</Text>
  //       <Text style={styles.sentEmail}>{t('verification_email_sent')}</Text>
  //       <TouchableOpacity>
  //         <Text style={styles.didntGetEmail}>{t('didnt_get_email')}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  // const renderVerifyContainer = false && (
  //   <View style={styles.notVerified}>
  //     <TouchableOpacity
  //       style={styles.closeBtn}
  //       onPress={() => navigation.goBack()}>
  //       <SVG.Close width={20} height={20} stroke={colors.black} />
  //     </TouchableOpacity>
  //     <View style={styles.notVerifiedContainer}>
  //       <Image source={images.sentEmail} style={styles.imageNotVerifyStyle} />
  //       <Text style={[styles.emailNotVerified, {width: 270}]}>
  //         {t('email_verified')}
  //       </Text>
  //     </View>
  //   </View>
  // );

  // const renderNotVerifiedContainer = !userEmailIsVerified && (
  //   <View style={styles.notVerified}>
  //     <TouchableOpacity
  //       style={styles.closeBtn}
  //       onPress={() => navigation.goBack()}>
  //       <SVG.Close width={20} height={20} stroke={colors.black} />
  //     </TouchableOpacity>
  //     <View style={styles.notVerifiedContainer}>
  //       <View style={styles.imageWrapper}>
  //         <Image source={images.failedEmail} style={styles.imageStyle} />
  //       </View>
  //       <Text style={styles.emailNotVerified}>{t('email_not_verified')}</Text>
  //       <Text style={styles.sentEmail}>{t('sent_email_verification')}</Text>
  //       <TouchableOpacity>
  //         <Text style={styles.didntGetEmail}>{t('didnt_get_email')}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}>
          {renderContainer}
          {/* {renderNotVerifiedContainer} */}
          {/* {renderVerifyingContainer} */}
          {/* {renderVerifyContainer} */}
        </ScrollView>
        {!keyboardShown && (
          <Button
            style={{marginBottom: Math.max(bottomInset, 8)}}
            onPress={handleSubmit}
            title={t('save')}
            disable={!isValid}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
        )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 36 : 12,
  },
  verifiedStyle: {},
  headerWrapper: {
    marginTop: 10,
    marginBottom: 48,
  },
  headerTitle: {
    ...typography.h1,
    marginTop: 48,
  },
  updatemail: {
    ...typography.h5,
    color: colors.gray100,
    marginTop: 16,
  },
  inputStyle: {
    marginTop: 16,
  },
  error: {
    ...typography.error,
    marginTop: 4,
  },
  email: {
    marginTop: 24,
  },
  closeBtn: {alignSelf: 'flex-end'},
  notVerifiedContainer: {
    marginTop: 208,
  },
  notVerified: {},
  emailNotVerified: {
    ...typography.h1,
    marginTop: 24,
  },
  sentEmail: {
    ...typography.h4,
    color: colors.gray100,
    marginTop: 10,
  },
  didntGetEmail: {
    ...typography.link,
    marginTop: 56,
  },
  imageWrapper: {width: 40, height: 40},
  imageStyle: {width: 41.76, height: 34},
  imageNotVerifyStyle: {width: 42.67, height: 34.67},
});

export default ChangeEmail;
