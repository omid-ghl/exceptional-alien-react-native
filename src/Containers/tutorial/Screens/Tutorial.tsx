import {Button} from '@/Commons';
import {StackParamList} from '@/Navigators/Stacks';
import {useTutorialFinishedMutation} from '@/Services';
import {colors, images} from '@/Theme';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TutorialContent, TutorialImage} from '../Components';

const Tutorial: React.FC<StackScreenProps<StackParamList, 'tutorial'>> = ({
  navigation,
}) => {
  const [step, setStep] = useState(0);
  const {t} = useTranslation();
  const [finishTutorial, {isSuccess, isLoading}] =
    useTutorialFinishedMutation();

  const steps = useMemo(() => {
    return [
      {
        title: t('tutorial.title_1'),
        description: t('tutorial.desc_1'),
        image: images.tutorial1,
        fadeFrom: 'bottom',
      },
      {
        title: t('tutorial.title_2'),
        description: t('tutorial.desc_2'),
        image: images.tutorial2,
        fadeFrom: 'bottom',
      },
      {
        title: t('tutorial.title_3'),
        description: t('tutorial.desc_3'),
        image: images.tutorial3,
        fadeFrom: 'top',
      },
      {
        title: t('tutorial.title_4'),
        description: t('tutorial.desc_4'),
        image: images.tutorial4,
        fadeFrom: 'bottom',
      },
    ];
  }, [t]);

  const nextClick = useCallback(() => {
    if (step === steps.length - 1) {
      finishTutorial({is_finished_tutorial: 1});
      return;
    }
    setStep(step + 1);
  }, [finishTutorial, step, steps.length]);

  const backClick = useCallback(() => {
    if (step === 0) {
      return;
    }
    setStep(step - 1);
  }, [step]);

  useEffect(() => {
    if (isSuccess) {
      navigation.goBack();
    }
  }, [isSuccess, navigation]);

  const currentStep = steps[step];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {step === 0 && (
          <TutorialImage
            fadeFromTop={currentStep.fadeFrom === 'top'}
            image={currentStep.image}
            animationDuration={500}
          />
        )}
        {step === 1 && (
          <TutorialImage
            fadeFromTop={currentStep.fadeFrom === 'top'}
            image={currentStep.image}
            animationDuration={500}
          />
        )}
        {step === 2 && (
          <TutorialImage
            fadeFromTop={currentStep.fadeFrom === 'top'}
            image={currentStep.image}
            animationDuration={500}
          />
        )}
        {step === 3 && (
          <TutorialImage
            fadeFromTop={currentStep.fadeFrom === 'top'}
            image={currentStep.image}
            animationDuration={500}
          />
        )}
        <View style={styles.bottomContainer}>
          {step === 0 && (
            <TutorialContent
              title={currentStep.title}
              description={currentStep.description}
              animationDuration={500}
            />
          )}
          {step === 1 && (
            <TutorialContent
              title={currentStep.title}
              description={currentStep.description}
              animationDuration={500}
            />
          )}
          {step === 2 && (
            <TutorialContent
              title={currentStep.title}
              description={currentStep.description}
              animationDuration={500}
            />
          )}
          {step === 3 && (
            <TutorialContent
              title={currentStep.title}
              description={currentStep.description}
              animationDuration={500}
            />
          )}
          <Button
            title={step === steps.length - 1 ? t('complete') : t('next')}
            onPress={nextClick}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
          {step !== 0 && (
            <Button
              type="secondary"
              title={t('back')}
              onPress={backClick}
              style={styles.backButton}
            />
          )}
        </View>
      </SafeAreaView>
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
  },
  bottomContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

export default Tutorial;
