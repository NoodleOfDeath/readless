import assert from 'assert';
import { describe, it } from 'node:test';
import { SpiderService } from '../src/services/spider';

describe('fetches a url', () => {
  it('fetched and prints a url', async () => {
    const spider = new SpiderService();
    const target = 'https://www.bustle.com/life/memes-tweets-about-chatgpt-ai';
    try {
      const resp = await spider.fetch(target);
      assert(resp);
      assert(resp.title);
      assert(resp.json);
    } catch (e) {
      console.error(e);
      assert(false);
    }
  });
});
