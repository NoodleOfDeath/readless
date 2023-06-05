import { execSync } from 'child_process';
import fs from 'fs';
import p from 'path';

import { enStrings } from '../../core/client/locales/en';
import { GoogleService } from '../../server/src/services/google/GoogleService';

const LOCALE_DIR = '../core/client/locales';
const CORE_DIR = p.resolve('../core');
const locales = fs.readdirSync(p.resolve(LOCALE_DIR)).filter((locale) => !/(en|index)\.ts/.test(locale));

async function translate(obj: unknown, locale: string) {
  if (typeof obj === 'string') {
    return await GoogleService.translateText(obj, locale);
  }
  const translatedObject: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    translatedObject[key] = await translate(value, locale);
  }
  return translatedObject;
}

const enStat = fs.statSync(`${LOCALE_DIR}/en.ts`);
for (const locale of locales) {
  const target = `${LOCALE_DIR}/${locale}`;
  const stats = fs.statSync(target);
  if (stats.mtimeMs > enStat.mtimeMs) {
    console.log(`Skipping ${target}`);
    continue;
  }
  console.log(`Translating ${target}`);
  const newStrings = await translate(enStrings, locale.replace('.ts', '').replace(/[A-Z]/, (match) => `-${match.toLowerCase()}`));
  const content = `
import { enStrings } from './en';

export const ${locale.replace('.ts', '')}Strings: typeof enStrings = ${JSON.stringify(newStrings, null, 2).replace(/"(\w+)":/g, '$1:')};
  `;
  fs.writeFileSync(target, content);
  execSync(`(cd ${CORE_DIR} && yarn format)`);
}
