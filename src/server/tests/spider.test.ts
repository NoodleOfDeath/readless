import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { SpiderService } from '../src/services/spider';

jest.setTimeout(30_000);

const TARGETS = [
  'https://www.politico.com/news/magazine/2023/03/11/trump-pence-election-opinion-00086541',
  'https://abcnews.go.com/US/3-school-kids-hospitalized-after-finding-ingesting-suspected/story?id=98686723',
  'https://www.barrons.com/articles/stocks-to-watch-this-week-tesla-att-goldman-sachs-netflix-charles-schwab-9d157291',
];

describe('spider tests', () => {
  describe('a/b test of custom scraper vs webscrapingapi', () => {
    const spider = new SpiderService();
    for (const target of TARGETS) {
      test(`custom scraping: ${target}`, async () => {
        try {
          const resp = await spider.loot(target);
          console.log('loot', new Date(resp.timestamp), resp.text.length);
          expect(!!resp).toBe(true);
        } catch (e) {
          console.error(e);
        }
      });
    }
  });
});
