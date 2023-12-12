import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Keyboard,
  TextInput,
} from 'react-native';

import {Button, TextInputCustom} from '@/Commons';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/Hooks';
import {useFormik} from 'formik';
import {useEditProfileMutation} from '@/Services';
import {IEditProfile} from './EditProfile';
import {setUser} from '@/Store/auth';
import {User} from '@/Models';

const PersonalDetail: React.FC<
  StackScreenProps<StackParamList, 'personalDetail'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.auth.user);

  const [editProfile, {isSuccess, isLoading, data: userData}] =
    useEditProfileMutation();
  const lastNameRef = useRef<TextInput>(null);

  const performEdit = useCallback(
    (values: IEditProfile.FormState) => {
      Keyboard.dismiss();
      editProfile({
        first_name: values.firstname,
        last_name: values.lastname,
      });
    },
    [editProfile],
  );

  const {handleChange, handleBlur, handleSubmit, values, isValid} =
    useFormik<IEditProfile.FormState>({
      initialValues: {
        firstname: user?.first_name,
        lastname: user?.last_name,
      },
      onSubmit: performEdit,
    });

  useEffect(() => {
    if (isSuccess && userData?.data) {
      dispatch(setUser(userData.data as User));
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [dispatch, isSuccess, navigation, userData?.data]);

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerWrapper}>
            <Text style={styles.headerTitle}>{t('personal_details')}</Text>
          </View>

          <View>
            <TextInputCustom
              label={t('first_name')}
              style={[styles.inputStyle, styles.firstName]}
              blurOnSubmit={false}
              autoComplete="name"
              returnKeyType="next"
              value={values.firstname}
              onChangeText={handleChange('firstname')}
              onBlur={handleBlur('firstname')}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />

            <TextInputCustom
              label={t('last_name')}
              style={styles.inputStyle}
              returnKeyType="done"
              value={values.lastname}
              onChangeText={handleChange('lastname')}
              autoComplete="name-family"
              ref={lastNameRef}
              onBlur={handleBlur('lastName')}
              onSubmitEditing={handleSubmit as () => void}
            />
          </View>

          <Button
            style={{marginTop: 349}}
            onPress={handleSubmit}
            title={t('save')}
            disable={!isValid}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
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
  inputStyle: {
    marginTop: 16,
  },
  firstName: {
    marginTop: 24,
  },
});

export default PersonalDetail;
