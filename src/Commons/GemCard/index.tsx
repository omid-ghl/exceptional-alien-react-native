import React from 'react';
import {IGemCard} from '@/Commons/GemCard/GemCard';
import Card from '../Card';
import {useTranslation} from 'react-i18next';

const GemCard = (props: IGemCard.IProps) => {
  const {
    isSkeleton,
    onPress,
    style,
    size,
    gem,
    variant,
    isSelected,
    onOptionsPress,
  } = props;
  const {t} = useTranslation();

  if (!gem && !isSkeleton) {
    return null;
  }

  return (
    <Card
      backImage={
        size === 'small' ? gem?.portrait_feature_image : gem?.feature_image
      }
      cardName={t('gem')}
      logoTitle={gem?.gem_categories?.[0]?.name}
      logoImage={
        gem?.gem_categories?.[0]?.image_icon &&
        typeof gem.gem_categories[0].image_icon === 'string'
          ? gem.gem_categories[0].image_icon
          : undefined
      }
      titleText={gem?.name}
      caption={gem?.location?.name}
      isSkeleton={isSkeleton}
      isSelected={isSelected}
      onOptionsPress={onOptionsPress}
      onPress={
        gem?.id !== undefined && (gem?.id as unknown as string) !== 'nonId'
          ? onPress
          : undefined
      }
      size={size}
      style={style}
      variant={variant}
      showLogo
      categoryId={gem?.gem_categories?.[0]?.id}
    />
  );
};

export default GemCard;
