import {
  de,
  enUS,
  es,
  fr,
  it,
  ptBR,
  ru,
} from 'date-fns/locale';
import LocalizedStrings from 'react-native-localization';

import { strings as deStrings } from './de';
import { strings as enStrings } from './en';
import { strings as esStrings } from './es';
import { strings as frStrings } from './fr';
import { strings as itStrings } from './it';
import { strings as ptStrings } from './pt';
import { strings as ruStrings } from './ru';

export const locales = new LocalizedStrings({
  de: deStrings,
  'de-DE': deStrings,
  en: enStrings,
  'en-US': enStrings,
  es: esStrings,
  'es-ES': esStrings,
  fr: frStrings,
  'fr-FR': frStrings,
  it: itStrings,
  'it-IT': itStrings,
  pt: ptStrings,
  'pt-BR': ptStrings,
  ru: ruStrings,
  'ru-RU': ruStrings,
});

export const fnsLocales = {
  de,
  en: enUS,
  'en-US': enUS,
  es,
  'es-ES': es,
  fr,
  'fr-FR': fr,
  it,
  'it-IT': it,
  pt: ptBR,
  'pt-BR': ptBR,
  ru,
};

export const getLocale = () => {
  return locales.getInterfaceLanguage().split('-')[0];
};

export const getFnsLocale = () => {
  return fnsLocales[getLocale() as keyof typeof fnsLocales];
};