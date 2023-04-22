import axios from 'axios';
import { load } from 'cheerio';
import ms from 'ms';
import puppeteer, {
  ElementHandle,
  Viewport,
  WaitForSelectorOptions,
} from 'puppeteer';
import UserAgent from 'user-agents';

import { OutletCreationAttributes } from '../../api/v1/schema';
import { BaseService } from '../base';

type PageOptions = WaitForSelectorOptions & {
  viewport?: Viewport;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectorAction = {
  selector: string;
  action: (el: ElementHandle<Element>) => Promise<void>;
  selectAll?: boolean;
  pageOptions?: PageOptions;
};

export type Loot = {
  url: string;
  rawText: string;
  date: Date;
  title: string;
  content: string;
  authors: string[];
};

export class PuppeteerService extends BaseService {

  static async fetch(url: string) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async open(
    url: string, 
    actions: SelectorAction[], 
    { viewport = { height: 1024, width: 1080 } }: PageOptions = {}
  ) {
    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'], 
        executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, 
        timeout: process.env.PUPPETEER_TIMEOUT ? Number(process.env.PUPPETEER_TIMEOUT) : ms('10s'), 
      });
      const page = await browser.newPage();
      await page.goto(url);

      // Set screen size
      await page.setViewport(viewport);

      const rawText = await page.evaluate(() => document.body.innerText);

      for (const selectorAction of actions) {
        const {
          selector, selectAll, pageOptions, action, 
        } = selectorAction;
        if (selector === 'disabled') {
          return '';
        }
        await page.setViewport(pageOptions?.viewport ?? viewport);
        const el = await page.waitForSelector(selector);
        if (selectAll) {
          const els = await page.$$(selector);
          for (const el of els) {
            await action(el);
          }
          continue;
        } else {
          await action(el);
        }
      }

      await browser.close();

      return rawText;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  public static async crawl(outlet: OutletCreationAttributes) {
    const { baseUrl, selectors } = outlet;
    const urls: string[] = [];
    await PuppeteerService.open(baseUrl, [
      {
        action: async (el) => {
          const url = await el.evaluate((el, selectors) => el.getAttribute(selectors.spider.attribute ?? 'href'), selectors);
          const domain = new URL(outlet.baseUrl).hostname.replace(/^www\./, '');
          if (/^https?:\/\//.test(url) && !new RegExp(`^https?://(?:www\\.)?${domain}`).test(url)) {
            return;
          }
          if (!/^https?:\/\//.test(url)) {
            urls.push(`${baseUrl}${url}`);
          } else {
            urls.push(url);
          }
        }, 
        selectAll: true,
        selector: selectors.spider.selector,
      },
    ]);
    return urls;
  }

  public static async loot(url: string, outlet: OutletCreationAttributes, content?: string): Promise<Loot> {
    const loot: Loot = {
      authors: [],
      content: content ?? '',
      date: new Date(0),
      rawText: content ?? '',
      title: '',
      url,
    };
    function clean(text = '') {
      return text
        .replace(/<(\w+)>.*?<\/\1>/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(/\n\n+/g, '\n')
        .trim();
    }
    if (!content) {
      const staticText = await PuppeteerService.fetch(url);
      if (staticText) {
        loot.rawText = staticText;
        const $ = load(staticText);
        $('script,style').remove();
        loot.content = clean($(outlet.selectors.article.selector).text());
        loot.title = clean($(outlet.selectors.title?.selector || 'title').text());
        const datetext = clean($(outlet.selectors.date.selector || 'time').text());
        const datetime = clean($(outlet.selectors.date.selector || 'time').attr('datetime'));
        const othertime = clean($(outlet.selectors.date.selector || 'time').attr('pubdate'));
        loot.date = new Date((datetime || datetext || othertime).replace(/^(?:published|updated):?\s*/i, ''));
        loot.authors = $(outlet.selectors.author.selector || 'author').map((i, el) => clean($(el).text())).get();
      }
      const actions: SelectorAction[] = [];
      if (!loot.title) {
        actions.push({
          action: async (el) => {
            loot.title = clean(await el.evaluate((el) => el.textContent));
          },
          selector: outlet.selectors.title?.selector || 'title',
        });
      }
      if (!loot.content) {
        actions.push({
          action: async (el) => {
            const $ = load(await el.evaluate((el) => el.innerHTML));
            $('script,style').remove();
            loot.content = $.text();
          },
          selector: outlet.selectors.article.selector,
        });
      }
      if (!loot.date.valueOf()) {
        actions.push({
          action: async (el) => {
            const datetext = clean(await el.evaluate((el) => el.textContent));
            const datetime = await el.evaluate((el) => el.getAttribute('datetime'));
            const othertime = await el.evaluate((el, attr) => el.getAttribute(attr), outlet.selectors.date.attribute ?? 'datetime');
            loot.date = new Date((datetime || datetext || othertime).replace(/^(?:published|updated):?\s*/i, ''));
          },
          selector: outlet.selectors.date.selector || 'time',
        });
      }
      if (!loot.authors.length) {
        actions.push({
          action: async (el) => {
            loot.authors = await el.evaluate((el) => {
              const authors: string[] = [];
              el.childNodes.forEach((e) => authors.push(e.textContent.replace(/^\s*by\s*/i, '')));
              return authors;
            });
          },
          selector: outlet.selectors.author.selector,
        });
      }
      if (actions.length) {
        await PuppeteerService.open(url, actions);
      }
    }
    return loot;
  }

}