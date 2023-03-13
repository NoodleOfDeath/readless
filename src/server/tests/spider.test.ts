import "dotenv/config";
import { describe, expect, jest, test } from "@jest/globals";

import { SpiderService } from "../src/services/spider";

jest.setTimeout(30_000);

const TARGETS = [
  "https://www.politico.com/news/magazine/2023/03/11/trump-pence-election-opinion-00086541",
];

describe("spider tests", () => {
  describe("a/b test of custom scraper vs webscrapingapi", () => {
    const spider = new SpiderService();
    for (const target of TARGETS) {
      test(`custom scraping: ${target}`, async () => {
        try {
          const resp = await spider.loot(target);
          console.log("loot", resp.filteredText);
          expect(!!resp).toBe(true);
        } catch (e) {
          console.error(e);
        }
      });
      test(`webscraping with webscraping api: ${target}`, async () => {
        try {
          const resp = await spider.scrape(target);
          console.log("scrape", resp.collapsed());
          expect(!!resp).toBe(true);
        } catch (e) {
          console.error(e);
        }
      });
    }
  });
});
