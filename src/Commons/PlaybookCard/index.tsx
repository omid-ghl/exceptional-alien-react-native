import React from 'react';
import Card from '../Card';
import {useTranslation} from 'react-i18next';
import {IPlaybookCard} from './PlaybookCard';

const PlaybookCard = (props: IPlaybookCard.IProps) => {
  const {isSkeleton, onPress, style, size, playbook, variant} = props;
  const {t} = useTranslation();

  if (!playbook && !isSkeleton) {
    return null;
  }

  return (
    <Card
      backImage={playbook?.user?.profile_image ?? undefined}
      cardName={t('playbook')}
      titleText={playbook?.title}
      caption={playbook?.user?.occupation ?? undefined}
      isSkeleton={isSkeleton}
      onPress={
        playbook?.id !== undefined &&
        (playbook?.id as unknown as string) !== 'nonId'
          ? onPress
          : undefined
      }
      size={size}
      style={style}
      variant={variant}
    />
  );
};

export default PlaybookCard;
