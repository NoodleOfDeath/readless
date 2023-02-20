import fetch from 'node-fetch';
import { BaseService } from '../base';
import { Loot } from './loot';

type FetchOpts = {};

export class SpiderService extends BaseService {
  async fetch(url: string, opts: FetchOpts = {}) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      return new Loot({ url, text });
    } catch (e) {
      console.error(e);
    }
  }
}
