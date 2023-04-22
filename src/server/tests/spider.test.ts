import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { SpiderService } from '../src/services/spider';

jest.setTimeout(30_000);

type Target = {
  url: string;
  date: Date;
  dateAttribute?: string;
  dateSelector?: string;
};

const TARGETS: Target[] = [
  // 'https://www.politico.com/news/magazine/2023/03/11/trump-pence-election-opinion-00086541',
  // 'https://abcnews.go.com/US/3-school-kids-hospitalized-after-finding-ingesting-suspected/story?id=98686723',
  // 'https://www.barrons.com/articles/stocks-to-watch-this-week-tesla-att-goldman-sachs-netflix-charles-schwab-9d157291',
  // 'https://fortune.com/2023/04/11/whole-foods-san-francisco-flagship-store-closes/',
  // 'https://www.billboard.com/music/music-news/beck-gorillaz-kimmel-performance-1235311022/',
  {
    date: new Date('Apr 18, 2023'),
    dateAttribute: 'datetime',
    dateSelector: 'time',
    url: 'https://www.theatlantic.com/ideas/archive/2023/04/fox-news-lost-lawsuit-won-war/673760/',
  },
  {
    date: new Date('Apr 19, 2023 4:13pm EST'),
    url: 'https://arstechnica.com/gadgets/2023/04/google-fi-gets-third-rebrand-in-8-years-adds-free-trial-for-esim-phones/',
  },
  {
    date: new Date('Apr 17, 2023'),
    url: 'https://www.popularmechanics.com/technology/a43589885/why-is-china-banning-rare-earth-metal-exports/',
  },
  {
    date: new Date('Apr 20, 2023, 06:36PM EDT'),
    dateAttribute: 'text',
    dateSelector: 'div[role="article"',
    url: 'https://www.forbes.com/video/6325467550112/twitter-removes-blue-checkmarks-from-verified-accountsunless-users-pay/',
  },
  {
    date: new Date('April 20, 2023 at 10:27 AM EDT'),
    url: 'https://fortune.com/2023/04/20/ikea-17-more-locations-us-expansion/',
  },
  {
    date: new Date('Apr 20 20232:44 AM EDT'),
    url: 'https://www.cnbc.com/2023/04/20/majority-of-gen-z-would-quit-their-jobs-over-company-values-linkedin.html',
  },
  {
    date: new Date('04/19/2023 12:40 PM EDT'),
    url: 'https://www.politico.com/news/2023/04/19/house-republicans-mayorkas-southern-border-00092808',
  },
];

describe('spider tests', () => {
  describe('a/b test of custom scraper vs webscrapingapi', () => {
    const spider = new SpiderService();
    for (const target of TARGETS) {
      test(`custom scraping: ${target}`, async () => {
        try {
          console.log(`scraping ${target.url}`);
          const resp = await spider.loot(target.url, target.dateSelector, target.dateAttribute);
          expect(resp.timestamp).toBeDefined();
          const date = new Date(resp.timestamp ?? 0);
          expect(date.getDate()).toBe(target.date.getDate());
          expect(date.getMonth()).toBe(target.date.getMonth());
          expect(date.getFullYear()).toBe(target.date.getFullYear());
        } catch (e) {
          console.error(e);
          expect(e).toBeUndefined();
        }
      });
    }
  });
});
