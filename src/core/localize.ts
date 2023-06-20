#!/usr/bin/env ts-node

import 'dotenv/config'; 
import { execSync } from 'child_process';
import fs from 'fs';
import p from 'path';

import { enStrings } from './src/client/locales/en';
import { GoogleService } from '../server/src/services/google/GoogleService';

const LOCALE_DIR = p.resolve('./src/client/locales');
const locales = fs.readdirSync(LOCALE_DIR).filter((locale) => !/(en|index)\.ts/.test(locale));

async function translate(obj: unknown, translatedObject: unknown = {}, locale: string) {
  if (typeof obj === 'string') {
    return await GoogleService.translateText(obj, locale);
  }
  for (const [key, value] of Object.entries(obj)) {
    if (!translatedObject[key]) {
      console.log(`Translating "${key}" for "${locale}"`);
      translatedObject[key] = await translate(value, translatedObject[key], locale);
    }
  }
  return translatedObject;
}

async function main() {
  const enStat = fs.statSync(`${LOCALE_DIR}/en.ts`);
  for (const file of locales) {
    const locale = file.replace('.ts', '').replace(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
    const target = `${LOCALE_DIR}/${file}`;
    const stats = fs.statSync(target);
    if (stats.mtimeMs > enStat.mtimeMs) {
      console.log(`Skipping ${target}`);
      continue;
    }
    console.log(`Translating ${target}`);
    const newStrings = await translate(enStrings, {}, locale);
    const content = `
import { enStrings } from './en';

export const ${file.replace('.ts', '')}Strings: typeof enStrings = ${JSON.stringify(newStrings, null, 2).replace(/"(\w+)":/g, '$1:')};
  `;
    fs.writeFileSync(target, content);
  }
  execSync('(cd .. && yarn format)');
}

main();