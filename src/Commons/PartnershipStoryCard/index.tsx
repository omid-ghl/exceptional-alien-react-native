import React, {useMemo} from 'react';
import Card from '../Card';
import {useTranslation} from 'react-i18next';
import {IPartnershipStoryCard} from './PartnershipStoryCard';
import {useLocationByIdQuery} from '@/Services/modules/discover';

const PartnershipStoryCard = (props: IPartnershipStoryCard.IProps) => {
  const {isSkeleton, onPress, style, size, partnershipStory, variant} = props;
  const {t} = useTranslation();
  const {data: location} = useLocationByIdQuery(
    {id: partnershipStory?.location_id},
    {skip: !partnershipStory?.location_id || !!partnershipStory.location},
  );

  if (!partnershipStory && !isSkeleton) {
    return null;
  }

  return (
    <Card
      backImage={partnershipStory?.tile_image}
      cardName={t('story')}
      titleText={partnershipStory?.title}
      isSkeleton={false}
      onPress={
        partnershipStory?.id !== undefined &&
        (partnershipStory?.id as unknown as string) !== 'nonId'
          ? onPress
          : undefined
      }
      size={size}
      style={style}
      variant={variant}
    />
  );
};

export default PartnershipStoryCard;
