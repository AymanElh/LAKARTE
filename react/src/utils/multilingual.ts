import i18n from '../i18n';

// Type for multilingual JSON objects from the database
export interface MultilingualText {
  en: string;
  fr: string;
  ar: string;
}

/**
 * Get the current language code from i18n
 */
export const getCurrentLocale = (): string => {
  return i18n.language || 'fr'; // Default to French if no language is set
};

/**
 * Extract text in the current language from a multilingual JSON object
 */
export const getLocalizedText = (multilingualObj: MultilingualText, locale?: string): string => {
  const currentLocale = locale || getCurrentLocale();
  
  // Try to get the text in the current locale
  if (multilingualObj && multilingualObj[currentLocale as keyof MultilingualText]) {
    return multilingualObj[currentLocale as keyof MultilingualText];
  }
  
  // Fallback order: fr -> en -> ar -> first available
  const fallbackOrder = ['fr', 'en', 'ar'];
  for (const fallbackLocale of fallbackOrder) {
    if (multilingualObj && multilingualObj[fallbackLocale as keyof MultilingualText]) {
      return multilingualObj[fallbackLocale as keyof MultilingualText];
    }
  }
  
  // Last resort: return any available value or empty string
  if (multilingualObj) {
    const values = Object.values(multilingualObj);
    return values.find(val => val && val.trim() !== '') || '';
  }
  
  return '';
};

/**
 * Hook to get localized text that updates when language changes
 */
export const useLocalizedText = (multilingualObj: MultilingualText): string => {
  const currentLocale = getCurrentLocale();
  return getLocalizedText(multilingualObj, currentLocale);
};

/**
 * Get a slug in the current language from a multilingual slug object
 */
export const getLocalizedSlug = (multilingualSlug: MultilingualText, locale?: string): string => {
  return getLocalizedText(multilingualSlug, locale);
};
