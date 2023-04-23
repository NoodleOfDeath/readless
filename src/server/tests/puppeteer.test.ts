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
  test('crawl-ars-technica', async () => {
    const outlet = Outlet.OUTLETS['ars-technica'];
    const urls = await PuppeteerService.crawl(outlet);
    expect(urls.length).toBeGreaterThan(0);
  });
});

describe('loot', () => {
  test('loot-abc', async () => {
    const loot = await PuppeteerService.loot('https://abcnews.go.com/International/us-embassy-staff-sudan-evacuated-amid-fighting/story?id=98767748', Outlet.OUTLETS.abc);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://abcnews.go.com/International/us-embassy-staff-sudan-evacuated-amid-fighting/story?id=98767748');
    expect(loot.title).toBe('US embassy staff in Sudan evacuated in \'fast and clean\' operation amid fighting - ABC News');
    expect(loot.content.length).toBeGreaterThan(0);
    expect(loot.authors.length).toBeGreaterThan(1);
    expect(loot.authors[0]).toBe('Shannon K. Crawford');
    expect(loot.authors[1]).toBe('Luis Martinez');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-23T14:52:00.000Z');
  });
  test('loot-advocate', async () => {
    const loot = await PuppeteerService.loot('https://www.advocate.com/crime/kokomo-city-koko-da-doll', Outlet.OUTLETS.advocate);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://www.advocate.com/crime/kokomo-city-koko-da-doll');
    expect(loot.title).toBe('Koko Da Doll, Trans Woman Starring in ‘Kokomo City’ Doc, Killed in Atlanta');
    expect(loot.content.length).toBeGreaterThan(0);
    expect(loot.authors.length).toBeGreaterThan(0);
    expect(loot.authors[0]).toBe('Alex Cooper');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-23T15:18:00.000Z');
  });
  test('loot-aei', async () => {
    const loot = await PuppeteerService.loot('https://www.aei.org/research-products/report/the-american-universitys-path-to-illiberalism/', Outlet.OUTLETS.aei);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://www.aei.org/research-products/report/the-american-universitys-path-to-illiberalism/');
    expect(loot.title).toBe('The American University’s Path to Illiberalism | American Enterprise Institute - AEI');
    expect(loot.content.length).toBeGreaterThan(0);
    expect(loot.authors.length).toBeGreaterThan(0);
    expect(loot.authors[0]).toBe('Robert Manzer');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-20T04:00:00.000Z');
  });
  test('loot-bbc', async () => {
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
  });
  test('loot-barrons', async () => {
    const loot = await PuppeteerService.loot('https://www.barrons.com/articles/at-t-cash-flow-dividend-stock-earnings-fea3533-1a9ce2d3f5fb?mod=RTA', Outlet.OUTLETS.barrons);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://www.barrons.com/articles/at-t-cash-flow-dividend-stock-earnings-fea3533-1a9ce2d3f5fb?mod=RTA');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-21T04:00:00.000Z');
  });
  test('loot-billboard', async () => {
    const loot = await PuppeteerService.loot('https://www.billboard.com/music/music-news/chloe-bailey-beyonce-renaissance-world-tour-opener-response-1235312795/', Outlet.OUTLETS.billboard);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://www.billboard.com/music/music-news/chloe-bailey-beyonce-renaissance-world-tour-opener-response-1235312795/');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-21T04:00:00.000Z');
  });
  test('loot-forbes', async () => {
    const loot = await PuppeteerService.loot('https://www.forbes.com/sites/alisondurkee/2023/04/21/mifepristone-supreme-court-keeps-abortion-pills-legal-at-least-for-now-extending-earlier-pause-on-ruling/', Outlet.OUTLETS.forbes);
    expect(loot).toBeDefined();
    expect(loot.url).toBe('https://www.forbes.com/sites/alisondurkee/2023/04/21/mifepristone-supreme-court-keeps-abortion-pills-legal-at-least-for-now-extending-earlier-pause-on-ruling/');
    expect(loot.date).toBeDefined();
    expect(loot.date).toBeInstanceOf(Date);
    expect(loot.date?.toISOString()).toBe('2023-04-21T22:51:00.000Z');
  });
});