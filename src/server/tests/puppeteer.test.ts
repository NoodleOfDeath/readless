import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

jest.setTimeout(30_000);

import { Outlet } from '../src/api/v1/schema/resources/outlet/Outlet.model';
import { PuppeteerService } from '../src/services/puppeteer';

describe('crawl', () => {
  test('crawl-single', async () => {
    const outlet = Outlet.OUTLETS['ars-technica'];
    const urls = await PuppeteerService.crawl(outlet);
    expect(urls.length).toBeGreaterThan(0);
    console.log(urls);
  });
  for (const [_, outlet] of Object.entries(Outlet.OUTLETS)) {
    test(`crawl ${outlet.name}`, async () => {
      const urls = await PuppeteerService.crawl(outlet);
      expect(urls.length).toBeGreaterThan(0);
      console.log(urls);
    });
  }
});

describe('loot', () => {
  test('loot-single', async () => {
    const loot = await PuppeteerService.loot('https://www.bbc.com/news/world-us-canada-65356390', Outlet.OUTLETS.bbc);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://www.bbc.com/news/world-us-canada-65356390');
    expect(loot.title).toBe('Mifepristone: US Supreme Court preserves abortion drug access - BBC News');
    expect(loot.content.length).toBeGreaterThan(0);
    expect(loot.authors.length).toBeGreaterThan(0);
    expect(loot.authors[0]).toBe('Holly Honderich');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-22T01:53:48.000Z');
    console.log(loot);
  });
});