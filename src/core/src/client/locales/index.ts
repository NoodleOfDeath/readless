import {
  FNS_LOCALES,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from './types';

export * from './types';

export const getLocaleBase = (lang = 'en') => (): SupportedLocale => {
  const parts = lang.split('-');
  if (/^zh/i.test(lang) && parts.length > 2) {
    lang = `${parts[0]}-${parts[2].toUpperCase()}`;
  }
  if (!SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
    if (parts.length > 0 && SUPPORTED_LOCALES.includes(parts[0] as SupportedLocale)) {
      lang = parts[0] as SupportedLocale;
    } else {
      return 'en';
    }
  }
  return lang as SupportedLocale;
};

export const getFnsLocaleBase = (lang = 'en') => () => {
  return FNS_LOCALES[lang as keyof typeof FNS_LOCALES] ?? FNS_LOCALES[getLocaleBase(lang)() as keyof typeof FNS_LOCALES];
};