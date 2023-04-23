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
import { maxDate, parseDate } from '../../utils';
import { BaseService } from '../base';

type PageOptions = WaitForSelectorOptions & {
  viewport?: Viewport;
};

type ReplacePattern = string | RegExp | {
  expr: string | RegExp,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repl: string,
};

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

export type LootOptions = {
  /** initial content if already fetched elsewhere */
  content?: string;
  /** selectors to remove from DOM */
  ignore?: string;
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
    const { baseUrl, selectors: { spider } } = outlet;
    if (spider.selector === 'disabled') {
      return [];
    }
    const domain = new URL(baseUrl).hostname.replace(/^www\./, '');
    const urls: string[] = [];
    await PuppeteerService.open(baseUrl, [
      {
        action: async (el) => {
          const url = await el.evaluate((el, spider) => el.getAttribute(spider.attribute ?? 'href'), spider);
          // exclude external links
          if (/^https?:\/\//.test(url) && !new RegExp(`^https?://(?:www\\.)?${domain}`).test(url)) {
            return;
          }
          // fix relative hrefs
          if (!/^https?:\/\//.test(url)) {
            urls.push(`${baseUrl}${url}`);
          } else {
            urls.push(url);
          }
        }, 
        selectAll: true,
        selector: spider.selector,
      },
    ]);
    return urls;
  }

  public static async loot(
    url: string, 
    outlet: OutletCreationAttributes, 
    {
      content,
      ignore = 'img,script,source,style',
    }: LootOptions = {}
  ): Promise<Loot> {
    
    const loot: Loot = {
      authors: [],
      content: content ?? '',
      date: new Date(0),
      rawText: content ?? '',
      title: '',
      url,
    };
    
    function clean(text?: string, ...patterns: ReplacePattern[]) {
      let newText = (text ?? '')
        .replace(/\s\s+/g, ' ')
        .replace(/\t\t+/g, '\t')
        .replace(/\n\n+/g, '\n')
        .trim();
      for (const pattern of patterns) {
        if (typeof pattern === 'string' || pattern instanceof RegExp) {
          newText = newText.replace(pattern, '');
        } else {
          newText = newText.replace(pattern.expr, pattern.repl);
        }
      }
      return newText;
    }
    
    function selectDate(dates: string[]) {
      return maxDate(...dates.map((date) => parseDate(clean(date), outlet.timezone)));
    }
    
    if (!content) {
      
      const rawHtml = await PuppeteerService.fetch(url);
      const {
        article, author, date, title, 
      } = outlet.selectors;
      
      const authors: string[] = [];
      const dates: string[] = [];
      
      if (rawHtml) {
        
        loot.rawText = rawHtml;
        const $ = load(rawHtml);
        $(ignore).remove();
        
        const extract = (sel: string, attr?: string): string => {
          if (attr && clean($(sel)?.attr(attr))) {
            return clean($(sel).attr(attr));
          }
          return clean($(sel)?.text());
        };
        
        loot.content = extract(article.selector, article.attribute);
        loot.title = extract(title?.selector || 'title', title?.attribute);
        
        dates.push(...[
          extract(date.selector),
          extract(date.selector, 'datetime'),
        ]);
        if (date.attribute) {
          dates.push(
            extract(date.selector, date.attribute)
          );
        }
        
        authors.push(...$(author.selector || 'author').map((i, el) => clean($(el).text(), /^\s*by:?\s*/i)).get());
      }
      
      const actions: SelectorAction[] = [];
      
      if (!loot.title) {
        actions.push({
          action: async (el) => {
            loot.title = clean(await el.evaluate((el) => el.textContent));
          },
          selector: title?.selector || 'title',
        });
      }
      
      if (!loot.content) {
        actions.push({
          action: async (el) => {
            const $ = load(await el.evaluate((el) => el.innerHTML));
            $(ignore).remove();
            loot.content = $.text();
          },
          selector: article.selector,
        });
      }
      
      actions.push({
        action: async (el) => {
          dates.push(...[
            await el.evaluate((el) => el.textContent),
            await el.evaluate((el) => el.getAttribute('datetime')),
          ]);
          if (date.attribute) {
            dates.push(
              await el.evaluate((el, attr) => el.getAttribute(attr), date.attribute)
            );
          }
        },
        selector: date.selector,
      });
      
      actions.push({
        action: async (el) => {
          authors.push(...await el.evaluate((el) => {
            const names: string[] = [];
            el.childNodes.forEach((e) => names.push(e.textContent));
            return names;
          }));
        },
        selector: author.selector,
      });
      
      await PuppeteerService.open(url, actions);
      
      loot.date = selectDate(dates);
      loot.authors = authors.map((a) => clean(a, /^\s*by:?\s*/i));
      
    }
    return loot;
  }

}