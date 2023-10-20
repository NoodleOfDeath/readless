import { SupportedLocale } from '~/api';
import { getFnsLocaleBase, getLocaleBase } from '~/core';

export * from '~/core/locales';

export const getLocale = getLocaleBase('en') as () => SupportedLocale;
export const getFnsLocale = getFnsLocaleBase('en');