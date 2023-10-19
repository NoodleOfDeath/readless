import { Locale } from 'date-fns';
import {
  ar,
  arSA,
  ca,
  cs,
  da,
  de,
  deAT,
  el,
  enUS,
  es,
  faIR,
  fi,
  fr,
  he,
  hi,
  hr,
  hu,
  id,
  it,
  ja,
  ko,
  ms,
  nb,
  nl,
  pl,
  pt,
  ptBR,
  ro,
  ru,
  sk,
  sv,
  th,
  tr,
  uk,
  vi,
  zhCN,
  zhHK,
  zhTW,
} from 'date-fns/locale';

import { arStrings } from './ar';
import { caStrings } from './ca';
import { csStrings } from './cs';
import { daStrings } from './da';
import { deStrings } from './de';
import { elStrings } from './el';
import { enStrings } from './en';
import { esStrings } from './es';
import { faStrings } from './fa';
import { fiStrings } from './fi';
import { frStrings } from './fr';
import { heStrings } from './he';
import { hiStrings } from './hi';
import { hrStrings } from './hr';
import { huStrings } from './hu';
import { idStrings } from './id';
import { itStrings } from './it';
import { jaStrings } from './ja';
import { koStrings } from './ko';
import { msStrings } from './ms';
import { nbStrings } from './nb';
import { nlStrings } from './nl';
import { plStrings } from './pl';
import { ptBRStrings } from './ptBR';
import { ptPTStrings } from './ptPT';
import { roStrings } from './ro';
import { ruStrings } from './ru';
import { skStrings } from './sk';
import { svStrings } from './sv';
import { thStrings } from './th';
import { trStrings } from './tr';
import { ukStrings } from './uk';
import { viStrings } from './vi';
import { zhCNStrings } from './zhCN';
import { zhTWStrings } from './zhTW';

import { SupportedLocale } from '~/api';

export const LOCALE_MAP = {
  ar: arStrings,
  'ar-SA': arStrings,
  ca: caStrings,
  cs: csStrings,
  'cs-CZ': csStrings,
  da: daStrings,
  'da-DK': daStrings,
  de: deStrings,
  'de-AT': deStrings,
  'de-DE': deStrings,
  el: elStrings,
  'el-CY': elStrings,
  'el-GR': elStrings,
  en: enStrings,
  'en-AU': enStrings,
  'en-GB': enStrings,
  'en-IE': enStrings,
  'en-US': enStrings,
  es: esStrings,
  'es-ES': esStrings,
  fa: faStrings,
  'fa-IR': faStrings,
  fi: fiStrings,
  'fi-FI': fiStrings,
  fr: frStrings,
  'fr-CA': frStrings,
  'fr-FR': frStrings,
  he: heStrings,
  hi: hiStrings,
  hr: hrStrings,
  hu: huStrings,
  id: idStrings,
  it: itStrings,
  'it-IT': itStrings,
  ja: jaStrings,
  ko: koStrings,
  ms: msStrings,
  nb: nbStrings,
  nl: nlStrings,
  pl: plStrings,
  pt: ptPTStrings,
  'pt-BR': ptBRStrings,
  'pt-PT': ptPTStrings,
  ro: roStrings,
  ru: ruStrings,
  sk: skStrings,
  sv: svStrings,
  th: thStrings,
  tr: trStrings,
  uk: ukStrings,
  vi: viStrings,
  zh: zhCNStrings,
  'zh-CN': zhCNStrings,
  'zh-HK': zhCNStrings,
  'zh-TW': zhTWStrings,
};

export const SUPPORTED_LOCALES = [
  'ar',
  'ca',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'fa',
  'fi',
  'fr',
  'he',
  'hi',
  'hr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'ms',
  'nb',
  'nl',
  'pl',
  'pt',
  'pt-BR',
  'pt-PT',
  'ro',
  'ru',
  'sk',
  'sv',
  'th',
  'tr',
  'uk',
  'vi',
  'zh',
  'zh-CN',
  'zh-TW',
] as const;

export type ClientSupportedLocale = typeof SUPPORTED_LOCALES[number];

export const FNS_LOCALES: Record<keyof typeof LOCALE_MAP, Locale> = {
  ar,
  'ar-SA': arSA,
  ca,
  cs,
  'cs-CZ': cs,
  da,
  'da-DK': da,
  de,
  'de-AT': deAT,
  'de-DE': de,
  el,
  'el-CY': el,
  'el-GR': el,
  en: enUS,
  'en-AU': enUS,
  'en-GB': enUS,
  'en-IE': enUS,
  'en-US': enUS,
  es,
  'es-ES': es,
  fa: faIR,
  'fa-IR': faIR,
  fi,
  'fi-FI': fi,
  fr,
  'fr-CA': fr,
  'fr-FR': fr,
  he,
  hi,
  hr,
  hu,
  id,
  it,
  'it-IT': it,
  ja,
  ko,
  ms,
  nb,
  nl,
  pl,
  pt,
  'pt-BR': ptBR,
  'pt-PT': pt,
  ro,
  ru,
  sk,
  sv,
  th,
  tr,
  uk,
  vi,
  zh: zhHK,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
};

export const getLocaleBase = (lang = navigator.language) => (): SupportedLocale => {
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

export const getFnsLocaleBase = (lang = navigator.language) => () => {
  return FNS_LOCALES[lang as keyof typeof FNS_LOCALES] ?? FNS_LOCALES[getLocaleBase(lang)() as keyof typeof FNS_LOCALES];
};