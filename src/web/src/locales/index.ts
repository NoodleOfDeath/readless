import { getFnsLocaleBase, getLocaleBase } from '~/core';

export * from '~/core/locales';

export const getLocale = getLocaleBase(navigator.language);
export const getFnsLocale = getFnsLocaleBase(navigator.language);