import UserAgent from 'user-agents';
import axios from 'axios';

import { BaseService } from '../base';
import { Loot } from './loot';
import {
  ExtractRule,
  ExtractRuleMap,
  ScrapeOpts,
  ScrapeResponse,
  WS_API,
  encodeScrapeOpts,
  mappedScrapeLoot,
} from './scrape';

export class SpiderService extends BaseService {
  /**
   * preset extract rules named after spider
   * species
   */
  static ExtractRules = {
    /** default and most common spider species */
    agelenidae: new ExtractRuleMap({
      title: {
        selector: 'title',
        output: 'text',
      },
      text: {
        selector: 'p,blockquote',
        output: 'text',
      },
    }),
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
    const text = await this.fetch(url);
    const loot = new Loot({ url, text });
    return loot;
  }

  /** WebscrapingAPI implementation */
  async scrape<T extends { [key: string]: ExtractRule }>(
    url: string,
    { api_key = process.env.WS_API_KEY, extract_rules, ...opts }: Partial<ScrapeOpts<T>> = {},
  ) {
    const params = encodeScrapeOpts({
      url,
      api_key,
      extract_rules,
      ...opts,
    });
    const fullPath = `${WS_API}/v1?${params.toString()}`;
    console.log('fetching from', fullPath);
    const { data } = await axios.get(fullPath);
    if (!extract_rules) return data;
    return mappedScrapeLoot(data as ScrapeResponse<T>);
  }
}
