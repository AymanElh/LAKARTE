import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import frTranslation from './locales/fr';
import enTranslation from './locales/en';
import arTranslation from './locales/ar';
import { LanguageOption } from '../types';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: frTranslation,
      },
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export const languageOptions: LanguageOption[] = [
  { 
    code: 'fr', 
    label: 'Français', 
    flag: '🇫🇷' 
  },
  { 
    code: 'en', 
    label: 'English', 
    flag: '🇬🇧' 
  },
  { 
    code: 'ar', 
    label: 'العربية (دارجة)', 
    flag: '🇲🇦' 
  },
];

export default i18n;