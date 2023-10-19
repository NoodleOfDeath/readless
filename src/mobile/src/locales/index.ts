import LocalizedStrings from 'react-native-localization';

import {
  LOCALE_MAP,
  getFnsLocaleBase,
  getLocaleBase,
} from '~/core';

export * from '~/core/locales';

export const strings = new LocalizedStrings(LOCALE_MAP);

export const getLocale = getLocaleBase(strings.getInterfaceLanguage());
export const getFnsLocale = getFnsLocaleBase(strings.getInterfaceLanguage());
