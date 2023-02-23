import axios from 'axios';
import { BaseService } from '../base';
import { Loot } from './loot';

type FetchOpts = {};

export class SpiderService extends BaseService {
  async fetch(url: string, opts: FetchOpts = {}) {
    try {
      const { data: text } = await axios.get(url);
      const loot = new Loot({ url, text });
      return loot;
    } catch (e) {
      console.error(e);
    }
  }

  async fetchAll(urls: string[], opts: FetchOpts = {}) {
    return Promise.all(urls.map((url) => this.fetch(url)));
  }
}
