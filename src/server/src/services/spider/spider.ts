import fetch from 'node-fetch';
import { BaseService } from '../base';
import { Loot } from './loot';

type FetchOpts = {};

export class SpiderService extends BaseService {
  async fetch(url: string | string[], opts: FetchOpts = {}) {
    const results: Loot[] = [];
    const urls = Array.isArray(url) ? url : [url];
    try {
      for (const url of urls) {
        const response = await fetch(url);
        const text = await response.text();
        const loot = new Loot({ url, text });
        results.push(loot);
      }
      return results;
    } catch (e) {
      console.error(e);
    }
  }
}
