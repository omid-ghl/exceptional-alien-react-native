import {navigate} from '@/Navigators';
import {showToast} from '@/Services';
import {t} from 'i18next';

export const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const normalizeImageField = (imageField: unknown) =>
  imageField && typeof imageField === 'string' && imageField.length > 0
    ? imageField.startsWith('/')
      ? imageField.substring(1)
      : imageField
    : undefined;

export const arrayToUrlParams = (key: string, array: Array<any>) => {
  let finalString = '';
  array.forEach((item, index) => {
    finalString += `&${key}[${index}]=${item}`;
  });
  return finalString;
};

export const loginIntrupt = () => {
  showToast({
    type: 'app',
    text: t('un_auth_alert.descriptioon'),
    rightAction: {
      title: t('un_auth_alert.actionText'),
      onPress: () => navigate('auth'),
    },
  });
};
