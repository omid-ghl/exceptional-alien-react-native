import {Button, TextInputCustom} from '@/Commons';
import {
  useGemNominationMutation,
  useLocationNominationMutation,
  usePersonNominationMutation,
} from '@/Services/modules/nominate';
import {colors, typography} from '@/Theme';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {INominateForm} from './NominateForm';

const NominateForm: React.FC<INominateForm.IProps> = ({
  forms,
  currentTab,
  renderTag,
  nominatingSuccesfuly = () => {},
}) => {
  const {t} = useTranslation();

  const [firstInputValue, setFirstInputValue] = useState<string>('');
  const [secondInputValue, setSecondInputValue] = useState<string>('');
  const [thirdInputValue, setThirdInputValue] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [
    gemNomination,
    {isSuccess: gemIsNominated, isLoading: gemIsNominating},
  ] = useGemNominationMutation();

  const [
    locationNomination,
    {isSuccess: locationIsNominated, isLoading: locationIsNominating},
  ] = useLocationNominationMutation();

  const [
    personNomination,
    {isSuccess: personIsNominated, isLoading: personIsNominating},
  ] = usePersonNominationMutation();

  const submitNomination = () => {
    if (currentTab === 1) {
      gemNomination({
        name: firstInputValue,
        address: secondInputValue,
        city: thirdInputValue,
        why: reason,
      });
    }
    if (currentTab === 2) {
      locationNomination({
        name: firstInputValue,
        country: secondInputValue,
        why: reason,
      });
    }
    if (currentTab === 3) {
      personNomination({
        name: firstInputValue,
        website: secondInputValue,
        social: thirdInputValue,
        why: reason,
      });
    }
  };

  const resetForm = () => {
    setFirstInputValue('');
    setSecondInputValue('');
    setThirdInputValue('');
    setReason('');
  };

  useEffect(resetForm, [currentTab]);

  useEffect(() => {
    if (gemIsNominated || locationIsNominated || personIsNominated) {
      nominatingSuccesfuly(true);
    }
  }, [
    gemIsNominated,
    locationIsNominated,
    nominatingSuccesfuly,
    personIsNominated,
  ]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>{t('nominate_gem')}</Text>
          <Text style={styles.headerDesc}>{t('nominate_gem_desc')}</Text>
        </View>
        <Text style={styles.nominateTitle}>{t('nominate_a')}</Text>
        <View>
          <FlatList
            horizontal
            data={forms}
            keyExtractor={item => item.id.toString()}
            renderItem={renderTag}
          />
          {forms.map(
            ({
              id,
              firstLabel,
              secondLabel,
              thirdLabel,
              hasThirdInput,
              reasonTitle,
            }) => {
              const isCurrentId = id === currentTab;
              return (
                <View key={id}>
                  {isCurrentId && (
                    <Animated.View entering={FadeIn.delay(200)}>
                      <TextInputCustom
                        label={firstLabel}
                        returnKeyType="next"
                        cursorColor={colors.primary}
                        style={styles.input}
                        value={firstInputValue}
                        onChangeText={setFirstInputValue}
                      />
                      <TextInputCustom
                        label={secondLabel}
                        returnKeyType="next"
                        cursorColor={colors.primary}
                        style={styles.input}
                        value={secondInputValue}
                        onChangeText={setSecondInputValue}
                      />
                      {hasThirdInput && (
                        <TextInputCustom
                          label={thirdLabel}
                          returnKeyType="next"
                          cursorColor={colors.primary}
                          style={styles.input}
                          value={thirdInputValue}
                          onChangeText={setThirdInputValue}
                        />
                      )}
                      <Text style={styles.label}>{reasonTitle}</Text>
                      <TextInput
                        multiline={true}
                        numberOfLines={10}
                        placeholder={t('type_something') || ''}
                        placeholderTextColor={colors.gray30}
                        style={styles.textArea}
                        onChangeText={setReason}
                        value={reason}
                      />
                      <Text style={styles.maxLenngth}>
                        {t('max_characters')}
                      </Text>
                    </Animated.View>
                  )}
                </View>
              );
            },
          )}
        </View>
      </ScrollView>
      <Button
        isLoading={
          gemIsNominating || locationIsNominating || personIsNominating
        }
        style={styles.button}
        onPress={submitNomination}
        title="Submit"
        disable={!firstInputValue}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
  input: {
    marginTop: 40,
  },
  label: {
    ...typography.h5,
    marginTop: 40,
    color: colors.gray100,
    marginLeft: 10,
  },
  textArea: {
    ...typography.caption,
    height: 200,
    textAlignVertical: 'top',
    borderColor: colors.gray100,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  maxLenngth: {
    ...typography.caption,
    alignSelf: 'flex-end',
    color: colors.gray100,
    marginTop: 10,
  },
  headerWrapper: {
    marginTop: 40,
    marginBottom: 48,
  },
  headerTitle: {
    ...typography.h1,
  },
  headerDesc: {
    ...typography.h5,
    marginTop: 16,
    color: colors.gray100,
  },
  nominateTitle: {
    ...typography.h5,
    color: colors.gray100,
    marginBottom: 16,
  },
});

export default NominateForm;
