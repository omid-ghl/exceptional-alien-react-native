import React from 'react';
import Card from '../Card';
import {useTranslation} from 'react-i18next';
import {IStoryCard} from './StoryCard';

const StoryCard = (props: IStoryCard.IProps) => {
  const {isSkeleton, onPress, style, size, story, variant} = props;
  const {t} = useTranslation();

  if (!story && !isSkeleton) {
    return null;
  }

  return (
    <Card
      backImage={story?.tile_image}
      cardName={t('story')}
      titleText={story?.title}
      caption={story?.user_details?.occupation ?? undefined}
      isSkeleton={false}
      onPress={
        story?.id !== undefined && (story?.id as unknown as string) !== 'nonId'
          ? onPress
          : undefined
      }
      size={size}
      style={style}
      variant={variant}
    />
  );
};

export default StoryCard;
