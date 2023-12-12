import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '@/Navigators/Stacks';
import {colors, images, SVG, typography} from '@/Theme';
import {useTranslation} from 'react-i18next';
import {Button, TextInputCustom} from '@/Commons';

const SendFeedback: React.FC<
  StackScreenProps<StackParamList, 'sendFeedback'>
> = ({navigation}) => {
  const {t} = useTranslation();
  const [subject, setSubject] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.settingTitle}>{t('send_feedback')}</Text>
          <Text style={styles.titleDesc}>{t('sharing_feedback')}</Text>
          <TextInputCustom
            label={t('subject')}
            returnKeyType="done"
            autoComplete="password"
            cursorColor={colors.primary}
            style={styles.subjectInput}
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>{t('message')}</Text>
          <TextInput
            multiline={true}
            numberOfLines={10}
            placeholder={t('type_something')}
            style={{
              height: 200,
              textAlignVertical: 'top',
              borderColor: colors.gray100,
              borderWidth: 1,
              padding: 10,
            }}
          />
          <Button onPress={() => {}} style={{marginTop: 130}} title="Submit" />
          {false && (
            <>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => navigation.goBack()}>
                <SVG.Close width={20} height={20} stroke={colors.black} />
              </TouchableOpacity>
              <View style={styles.submittedContainer}>
                <Image source={images.check} style={{width: 45, height: 45}} />
                <Text style={styles.submittedTitle}>
                  {t('feedBack_submitted')}
                </Text>
                <Text style={styles.submittedDesc}>{t('thanks_feedBack')}</Text>
              </View>
            </>
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
    marginTop: 10,
    marginBottom: 48,
  },
  settingTitle: {
    ...typography.h1,
    marginTop: 43,
  },
  titleDesc: {
    ...typography.h5,
    marginTop: 16,
    color: colors.gray100,
  },
  subjectInput: {
    marginTop: 32,
  },
  label: {
    ...typography.h5,
    marginTop: 24,
    marginBottom: 10,
    color: colors.gray100,
  },
  closeBtn: {alignSelf: 'flex-end'},
  submittedContainer: {
    marginTop: 208,
  },
  submittedTitle: {
    ...typography.h1,
    marginTop: 24,
    width: 300,
  },
  submittedDesc: {
    ...typography.h4,
    marginTop: 10,
    color: colors.gray100,
  },
});

export default SendFeedback;
