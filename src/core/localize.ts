#!/usr/bin/env ts-node

import 'dotenv/config'; 
import { execSync } from 'child_process';
import fs from 'fs';
import p from 'path';

import { ArgumentParser } from 'argparse';

import { enStrings } from './src/client/locales/en';
import { GoogleService } from '../server/src/services/google/GoogleService';

const LOCALE_DIR = p.resolve('./src/client/locales');
const HISTORY_FILE = p.resolve('./src/client/locales/en-last.ts');
const locales = fs.readdirSync(LOCALE_DIR).filter((locale) => !/(?:en(?:-last)?|index|types)\.ts/.test(locale));

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

function sortByKeys(obj: unknown) {
  const keys = Object.keys(obj).sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  return Object.fromEntries(keys.map((k) => [k, obj[k]]));
}

type SyncOptions = {
  force?: boolean;
  skip?: boolean;
};

async function sync({
  force = false,
  skip = false,
}: SyncOptions = {}) {
  
  const enStat = fs.statSync(`${LOCALE_DIR}/en.ts`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let historyStrings: any = {};
  historyStrings = {};

  if (fs.existsSync(HISTORY_FILE)) {
    const history = fs.readFileSync(HISTORY_FILE, 'utf8');
    if (history) {
      const match = history.match(/export const enStrings = (\{[\s\S]*\});/m);
      if (match && match[1]) {
        eval(`historyStrings = ${match[1]}`);
      }
    }
  }
  
  for (const file of locales) {
    const locale = file.replace('.ts', '').replace(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
    const target = `${LOCALE_DIR}/${file}`;
    const stats = fs.statSync(target);
    if (skip && stats.mtimeMs > enStat.mtimeMs) {
      console.log(`Skipping ${target}`);
      continue;
    }
    console.log(`Translating ${target}`);
    let toTranslate: Partial<typeof enStrings> = enStrings;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let oldStrings: any = {};
    oldStrings = {};
    if (!force) {
      const contents = fs.readFileSync(target, 'utf8');
      const match = contents.match(/typeof enStrings = (\{[\s\S]*\});/);
      if (match && match[1]) {
        eval(`oldStrings = ${match[1]}`);
      }
      toTranslate = {};
      for (const key of Object.keys(enStrings)) {
        if (!(key in oldStrings) || enStrings[key] !== historyStrings[key]) {
          console.log(enStrings[key], historyStrings[key]);
          toTranslate[key] = enStrings[key];
        }
      }
      for (const key of Object.keys(oldStrings)) {
        if (!(key in enStrings)) {
          delete oldStrings[key];
        }
      }
    }
    const newStrings = sortByKeys(await translate(toTranslate, oldStrings, locale));
    const content = `
import { enStrings } from './en';

export const ${file.replace('.ts', '')}Strings: typeof enStrings = ${JSON.stringify(newStrings, null, 2).replace(/"(\w+)":/g, '$1:')}
  `;
    fs.writeFileSync(target, content);
  }
  
  const content = `
export const enStrings = {
${Object.entries(enStrings).map(([key, value]) => `  ${key}: ${JSON.stringify(value, null, 2)},`).join('\n')}
};
`;
  fs.writeFileSync(HISTORY_FILE, content);

  execSync('(cd .. && yarn format)');
  
}

async function main() {
  const parser = new ArgumentParser();
  parser.add_argument('-f', '--force', { action: 'store_true' });
  parser.add_argument('-s', '--skip', { action: 'store_true' });
  const args = parser.parse_args();
  await sync(args);
}

main();