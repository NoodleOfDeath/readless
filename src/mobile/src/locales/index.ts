import LocalizedStrings from 'react-native-localization';

import { SupportedLocale } from '~/api';
import {
  FNS_LOCALES,
  LOCALE_MAP,
  SUPPORTED_LOCALES,
} from '~/core';

export const strings = new LocalizedStrings(LOCALE_MAP);

export const getLocale = (): SupportedLocale => {
  let lang = strings.getInterfaceLanguage();
  const parts = lang.split('-');
  if (/^zh/i.test(lang) && parts.length > 2) {
    lang = `${parts[0]}-${parts[2].toUpperCase()}`;
  }
  if (!SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
    if (parts.length > 0 && SUPPORTED_LOCALES.includes(parts[0] as SupportedLocale)) {
      lang = parts[0] as SupportedLocale;
    } else {
      return SupportedLocale.En;
    }
  }
  return lang as SupportedLocale;
};

export const getFnsLocale = () => {
  return FNS_LOCALES[strings.getInterfaceLanguage() as keyof typeof FNS_LOCALES] ?? FNS_LOCALES[getLocale() as keyof typeof FNS_LOCALES];
};