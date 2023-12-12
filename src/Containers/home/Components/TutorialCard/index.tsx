import React from 'react';
import {TouchableOpacity, StyleSheet, Image, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors, SVG, images, variables, typography} from '@/Theme';
import {ITutorial} from './TutorialCard';
import {useAppSelector} from '@/Hooks';
import LinearGradient from 'react-native-linear-gradient';

const TutorialCard = (props: ITutorial.IProps) => {
  const {t} = useTranslation();
  const {onPress, style} = props;
  const user = useAppSelector(state => state.auth.user);

  if (!user) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.skeleton]} />
        <LinearGradient
          colors={['#000000FF', '#00000000', '#000000FF']}
          style={[styles.gradient]}
        />
      </View>
    );
  }

  if (user?.is_finished_tutorial === 1 || user?.is_finished_tutorial === '1') {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, style]}>
      <Image source={images.tutorialCard} style={styles.backImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{t('tutorial_content')}</Text>
        <View style={styles.startContent}>
          <Text style={styles.startText}>{t('start_tutorial')}</Text>
          <SVG.ChevronRight stroke={colors.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  backImage: {
    width: variables.dimensions.width - 40,
    height: variables.dimensions.width * 0.5,
    borderRadius: 10,
  },
  contentContainer: {
    position: 'absolute',
    left: 32,
    top: 16,
    bottom: 16,
    justifyContent: 'space-between',
  },
  titleText: {
    ...typography.h3,
    color: colors.white,
    width: '80%',
  },
  startContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startText: {
    ...typography.caption,
    color: colors.white,
    marginEnd: 8,
  },
  gradient: {
    width: variables.dimensions.width - 40,
    height: '100%',
    position: 'absolute',
    opacity: 0.5,
    borderRadius: 9,
  },
  skeleton: {
    width: variables.dimensions.width - 40,
    height: variables.dimensions.width * 0.5,
    borderRadius: 9,
    backgroundColor: colors.gray10,
  },
});

export default TutorialCard;
