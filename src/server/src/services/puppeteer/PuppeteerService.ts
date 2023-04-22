import puppeteer, {
  ElementHandle,
  Viewport,
  WaitForSelectorOptions,
} from 'puppeteer';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async open(
    url: string, 
    actions: SelectorAction[], 
    { viewport = { height: 1024, width: 1080 } }: PageOptions = {}
  ) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Set screen size
    await page.setViewport(viewport);

    const rawText = await page.evaluate(() => document.body.innerText);

    for (const selectorAction of actions) {
      const {
        selector, selectAll, pageOptions, action, 
      } = selectorAction;
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

  }

  public static async crawl(outlet: OutletCreationAttributes) {
    const { baseUrl, selectors } = outlet;
    const urls: string[] = [];
    await PuppeteerService.open(baseUrl, [
      {
        action: async (el) => {
          const url = await el.evaluate((el, selectors) => el.getAttribute(selectors.spider.attribute ?? 'href'), selectors);
          const domain = new URL(url).hostname.replace(/^www\./, '');
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
        selector:selectors.spider.selector,
      },
    ]);
    return urls;
  }

  public static async loot(url: string, outlet: OutletCreationAttributes, content?: string): Promise<Loot> {
    const loot: Loot = {
      authors: [],
      content: content ?? '',
      date: new Date(),
      rawText: content ?? '',
      title: '',
      url,
    };
    if (!content) {
      loot.rawText = await PuppeteerService.open(url, [
        {
          action: async (el) => {
            loot.title = await el.evaluate((el) => el.textContent);
          },
          selector: outlet.selectors.title?.selector || 'title',
        },
        { 
          action: async (el) => {
            loot.content = await el.evaluate((el) => el.textContent.replace(/<(\w+)>.*?<\/\1>/g, ''));
          },
          selector: outlet.selectors.article.selector,
        },
        {
          action: async (el) => {
            const datetext = await el.evaluate((el) => el.textContent);
            const datetime = await el.evaluate((el) => el.getAttribute('datetime'));
            const othertime = await el.evaluate((el, attr) => el.getAttribute(attr), outlet.selectors.date.attribute ?? 'datetime');
            loot.date = new Date((datetime || datetext || othertime).replace(/^(?:published|updated):?\s*/i, ''));
          },
          selector:  outlet.selectors.date.selector || 'time',
        },
        {
          action: async (el) => {
            loot.authors = await el.evaluate((el) => {
              const authors: string[] = [];
              el.childNodes.forEach((e) => authors.push(e.textContent.replace(/^\s*by\s*/i, '')));
              return authors;
            });
          },
          selector: outlet.selectors.author.selector,
        },
      ]);
    }
    return loot;
  }

}