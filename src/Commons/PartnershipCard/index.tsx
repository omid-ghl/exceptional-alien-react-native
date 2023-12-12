import React, {useMemo} from 'react';
import Card from '../Card';
import {useTranslation} from 'react-i18next';
import {IPartnershipCard} from './PartnershipCard';
import {normalizeImageField} from '@/Utils';
import {StyleSheet} from 'react-native';
import {colors, typography} from '@/Theme';

const PartnershipCard = (props: IPartnershipCard.IProps) => {
  const {isSkeleton, onPress, style, size, partnership, variant} = props;
  const {t} = useTranslation();

  const tags = useMemo(() => {
    if (!partnership) {
      return undefined;
    }

    const arr: string[] = [];
    if (partnership.count_playbooks && partnership.count_playbooks > 0) {
      if (partnership.count_playbooks === 1) {
        arr.push(t('playbookCount_one', {count: 1}));
      } else {
        arr.push(
          t('playbookCount_other', {count: partnership.count_playbooks}),
        );
      }
    }
    const storiesCount =
      partnership.count_stories && partnership.count_stories > 0
        ? partnership.count_stories
        : partnership.partnership_stories &&
          partnership.partnership_stories.length > 0
        ? partnership.partnership_stories.length
        : 0;
    if (storiesCount > 0) {
      if (storiesCount === 1) {
        arr.push(t('storyCount_one', {count: 1}));
      } else {
        arr.push(t('storyCount_other', {count: storiesCount}));
      }
    }
    if (arr.length === 0) {
      return undefined;
    }
    return arr;
  }, [t, partnership]);

  const mainImage = useMemo(
    () => normalizeImageField(partnership?.main_image_url?.path),
    [partnership?.main_image_url?.path],
  );

  const logoImage = useMemo(
    () => normalizeImageField(partnership?.partner_logo_url?.path),
    [partnership?.partner_logo_url?.path],
  );

  if (!partnership && !isSkeleton) {
    return null;
  }

  return (
    <Card
      backImage={mainImage}
      cardName={tags}
      titleText={partnership?.title}
      isSkeleton={isSkeleton}
      onPress={
        partnership?.id !== undefined &&
        (partnership?.id as unknown as string) !== 'nonId'
          ? onPress
          : undefined
      }
      size={size}
      style={style}
      variant={variant}
      logoTitle={partnership?.partner_name}
      logoImage={logoImage}
      showLogo
      logoImageStyle={styles.logoImage}
      logoTitleStyle={styles.logoTitle}
    />
  );
};

const styles = StyleSheet.create({
  logoImage: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
  },
  logoTitle: {
    ...typography.caption,
    color: colors.white,
    textTransform: 'none',
    marginLeft: 6,
  },
});

export default PartnershipCard;
