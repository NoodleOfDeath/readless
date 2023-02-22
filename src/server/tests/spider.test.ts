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
      console.log(resp.title);
      assert(resp.nodes);
      assert(resp.nodes.length > 0);
      resp.nodes.forEach((node) => console.log(node.rawText));
      // console.log(JSON.stringify(resp.json ?? {}, null, 2));
      setTimeout(() => assert(true), 500);
    } catch (e) {
      console.error(e);
      assert(false);
    }
  });
});
