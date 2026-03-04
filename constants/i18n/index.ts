import { en, Translations } from './en';
import { hi } from './hi';
import { te } from './te';

export type Locale = 'en' | 'hi' | 'te';

const translations: Record<Locale, Translations> = { en, hi, te };

export const getTranslations = (locale: Locale): Translations => translations[locale];

export const localeLabels: Record<Locale, string> = {
    en: 'EN',
    hi: 'हि',
    te: 'తె',
};

export type { Translations };
