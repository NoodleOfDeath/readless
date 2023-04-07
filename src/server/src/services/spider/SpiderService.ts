import axios from 'axios';
import UserAgent from 'user-agents';

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
import { BaseService } from '../base';

export class SpiderService extends BaseService {

  /**
   * preset extract rules named after spider
   * species
   */
  static ExtractRules = {
    /** default and most common spider species */
    agelenidae: new ExtractRuleMap({
      text: {
        output: 'text',
        selector: 'p,blockquote',
      },
      title: {
        output: 'text',
        selector: 'title',
      },
    }),
  };

  async fetch(url: string) {
    try {
      const { data: text } = await axios.get(url, {
        headers: { 
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
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
    const loot = new Loot({ text, url });
    return loot;
  }

  /** WebscrapingAPI implementation */
  async scrape<T extends { [key: string]: ExtractRule }>(
    url: string,
    {
      api_key = process.env.WS_API_KEY, extract_rules, ...opts 
    }: Partial<ScrapeOpts<T>> = {}
  ) {
    const params = encodeScrapeOpts({
      api_key,
      extract_rules,
      url,
      ...opts,
    });
    const fullPath = `${WS_API}/v1?${params.toString()}`;
    console.log('fetching from', fullPath);
    const { data } = await axios.get(fullPath);
    if (!extract_rules) {
      return data;
    }
    return mappedScrapeLoot(data as ScrapeResponse<T>);
  }

}
