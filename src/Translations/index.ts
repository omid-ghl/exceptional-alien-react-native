import i18n from 'i18next';
import {initReactI18next, Namespace, TFuncKey} from 'react-i18next';
import {en} from './resources';

export const resources = {
  en: {
    translation: en,
  },
} as const;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: resources,
  lng: 'en',
});

export type TranslationKey = TFuncKey<Namespace<'translation'>, undefined>;

export default i18n;
