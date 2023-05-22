import { Locale } from 'date-fns';
import {
  ar,
  arSA,
  de,
  enUS,
  es,
  fr,
  hu,
  it,
  ja,
  ko,
  nb,
  pt,
  ptBR,
  ru,
  th,
  uk,
  vi,
  zhCN,
  zhHK,
  zhTW,
} from 'date-fns/locale';
import LocalizedStrings from 'react-native-localization';

import { arStrings } from './ar';
import { deStrings } from './de';
import { enStrings } from './en';
import { esStrings } from './es';
import { frStrings } from './fr';
import { huStrings } from './hu';
import { itStrings } from './it';
import { jaStrings } from './ja';
import { koStrings } from './ko';
import { nbStrings } from './nb';
import { ptBRStrings } from './ptBR';
import { ptPTStrings } from './ptPT';
import { ruStrings } from './ru';
import { thStrings } from './th';
import { ukStrings } from './uk';
import { viStrings } from './vi';
import { zhCNStrings } from './zhCN';
import { zhTWStrings } from './zhTW';

const localeMap = {
  ar: arStrings,
  'ar-SA': arStrings,
  de: deStrings,
  en: enStrings,
  'en-AU': enStrings,
  'en-GB': enStrings,
  'en-IE': enStrings,
  'en-US': enStrings,
  es: esStrings,
  'es-ES': esStrings,
  fr: frStrings,
  'fr-CA': frStrings,
  'fr-FR': frStrings,
  hu: huStrings,
  it: itStrings,
  'it-IT': itStrings,
  ja: jaStrings,
  ko: koStrings,
  nb: nbStrings,
  pt: ptPTStrings,
  'pt-BR': ptBRStrings,
  'pt-PT': ptPTStrings,
  ru: ruStrings,
  th: thStrings,
  uk: ukStrings,
  vi: viStrings,
  zh: zhCNStrings,
  'zh-CN': zhCNStrings,
  'zh-HK': zhCNStrings,
  'zh-TW': zhTWStrings,
};

export const strings = new LocalizedStrings(localeMap);

export const fnsLocales: Record<keyof typeof localeMap, Locale> = {
  ar,
  'ar-SA': arSA,
  de,
  en: enUS,
  'en-AU': enUS,
  'en-GB': enUS,
  'en-IE': enUS,
  'en-US': enUS,
  es,
  'es-ES': es,
  fr,
  'fr-CA': fr,
  'fr-FR': fr,
  hu,
  it,
  'it-IT': it,
  ja,
  ko,
  nb,
  pt,
  'pt-BR': ptBR,
  'pt-PT': pt,
  ru,
  th,
  uk,
  vi,
  zh: zhHK,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
};

export const getLocale = (): keyof typeof localeMap => {
  let lang = strings.getInterfaceLanguage();
  const parts = lang.split('-');
  if (/^zh/i.test(lang) && parts.length > 2) {
    lang = `${parts[0]}-${parts[2].toUpperCase()}`;
  }
  if (!(lang in localeMap)) {
    if (parts.length > 1 && parts[0] in localeMap) {
      return parts[0] as keyof typeof localeMap;
    }
    return 'en';
  }
  return lang as keyof typeof localeMap;
};

export const getFnsLocale = () => {
  return fnsLocales[getLocale()];
};