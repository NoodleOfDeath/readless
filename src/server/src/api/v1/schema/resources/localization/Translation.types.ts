import { SupportedLocale } from '../../../../../core/locales';
import { DatedAttributes } from '../../types';

export type TranslationAttributes = DatedAttributes & {
  parentId: number;
  locale: SupportedLocale;
  attribute: string;
  value: string;
};

export type TranslationCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  locale: SupportedLocale;
  attribute: string;
  value: string;
};

export const PUBLIC_TRANSLATION_ATTRIBUTES = ['locale', 'attribute', 'value'] as const;

export type PublicTranslationAttributes = {
  locale: SupportedLocale;
  attribute: string;
  value: string;
};

export type Translatable = {
  translations?: { [key: string]: string };
}; 