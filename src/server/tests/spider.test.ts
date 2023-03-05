import 'dotenv/config';
import { describe, expect, jest, test} from '@jest/globals';

import { SpiderService } from '../src/services/spider';

jest.setTimeout(30_000);

const TARGETS = [
  'https://arstechnica.com/gadgets/2023/02/dont-worry-about-ai-breaking-out-of-its-box-worry-about-us-breaking-in/',
  'https://fortune.com/2023/02/24/microsoft-artificial-intelligence-ai-chatbot-sydney-rattled-users-before-chatgpt-fueled-bing/?showAdminBar=true',
  'https://www.cnbc.com/2023/02/22/how-to-invest-in-artificial-intelligence-etfs.html',
];

describe('spider tests', () => {
  
  describe('a/b test of custom scraper vs webscrapingapi', () => {
    const spider = new SpiderService();
    for (const target of TARGETS) {
      test(`custom scraping: ${target}`, async () => {
        try {
          const resp = await spider.loot(target);
          console.log('loot', resp.filteredText);
          expect(!!resp).toBe(true);
        } catch (e) {
          console.error(e);
        }
      });
      test(`webscraping with webscraping api: ${target}`, async () => {
        try {
          const resp = await spider.scrape(target);
          console.log('scrape', resp.collapsed());
          expect(!!resp).toBe(true);
        } catch (e) {
          console.error(e);
        }
      });
    }
  });
  
});
