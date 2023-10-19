import { ClientSupportedLocale as SupportedLocale } from '../../../../../core/locales';
import { DatedAttributes } from '../../types';

export type LocaleAttributes = DatedAttributes & {
  code: SupportedLocale;
};

export type LocaleCreationAttributes = Partial<DatedAttributes> & {
  code: SupportedLocale;
};

export const PUBLIC_LOCALE_ATTRIBUTES = ['code'] as const;

export type PublicLocaleAttributes = {
  code: SupportedLocale;
};