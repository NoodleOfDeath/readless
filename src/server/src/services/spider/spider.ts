import axios from 'axios';
import UserAgent from 'user-agents';
import { BaseService } from '../base';
import { Loot } from './loot';
import { ExtractRule, ScrapeLoot, ScrapeOpts, ScrapeResponse, WS_API, encodeScrapeOpts } from './scrape';

export class SpiderService extends BaseService {
  /**
   * preset extract rules named after spider
   * species
   */
  static ExtractRules = {
    /** default and most common spider species */
    agelenidae: {
      title: {
        selector: 'h1',
        output: 'text',
      } as ExtractRule,
      text: {
        selector: 'p,blockquote',
        output: 'text',
      } as ExtractRule,
    },
  };

  async fetch(url: string) {
    try {
      const { data: text } = await axios.get(url, {
        headers: {
          'User-Agent': new UserAgent().random().toString(),
        },
      });
      return text;
    } catch (e) {
      console.error(e);
    }
  }

  /** Custom scraping implementation */
  async loot(url: string) {
    try {
      const text = await this.fetch(url);
      const loot = new Loot({ url, text });
      return loot;
    } catch (e) {
      console.error(e);
    }
  }

  /** WebscrapingAPI implementation */
  async scrape<T extends ScrapeOpts['extract_rules']>(
    url: string,
    {
      api_key = process.env.WS_API_KEY,
      extract_rules = SpiderService.ExtractRules.agelenidae,
      ...opts
    }: Partial<ScrapeOpts> = {},
  ) {
    try {
      const params = encodeScrapeOpts({
        url,
        api_key,
        extract_rules,
        ...opts,
      });
      const fullPath = `${WS_API}/v1?${params.toString()}`;
      const { data } = await axios.get(fullPath);
      return new ScrapeLoot(data as ScrapeResponse<T>);
    } catch (e) {
      console.error(e);
    }
  }
}
