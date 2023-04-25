import axios from 'axios';
import { load } from 'cheerio';
import ms from 'ms';
import puppeteer, {
  Browser,
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
  dateMatches: string[];
  title: string;
  content: string;
  authors: string[];
};

export type LootOptions = {
  /** initial content if already fetched elsewhere */
  content?: string;
  /** selectors to remove from DOM */
  exclude?: string[];
};

export class PuppeteerService extends BaseService {
  
  static EXCLUDE_EXPRS = {
    depth0: [
      '^/?$',
    ],
    depth1: [
      '^/?$',
      '^/author',
      '^/contributor',
      '^/live',
      '^/topic',
      '^/video',
    ],
  };

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
    { 
      timeout = process.env.PUPPETEER_TIMEOUT ? Number(process.env.PUPPETEER_TIMEOUT) : ms('20s'),
      viewport = { height: 1024, width: 1080 },
    }: PageOptions = {}
  ) {
    let browser: Browser;
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox'], 
        executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, 
        timeout, 
      });
      const page = await browser.newPage();
      await page.goto(url, { timeout });

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
        const el = await page.waitForSelector(selector, { timeout: pageOptions?.timeout ?? timeout });
        if (selectAll) {
          const els = await page.$$(selector);
          for (const el of els) {
            await action(el);
          }
        } else {
          await action(el);
        }
      }

      return rawText;
    } catch (e) {
      console.log(e);
      return '';
    } finally {
      await browser?.close();
    }
  }

  public static async crawl(outlet: OutletCreationAttributes, { exclude = this.EXCLUDE_EXPRS.depth1 }: LootOptions = {}) {
    const { baseUrl, selectors: { spider } } = outlet;
    if (spider.selector === 'disabled') {
      return [];
    }
    const domain = new URL(baseUrl).hostname.replace(/^www\./, '');
    const domainExpr = new RegExp(`^https?://(?:www\\.)?${domain}`);
    const urls: string[] = [];
    const rawHtml = await PuppeteerService.fetch(baseUrl);
    const $ = load(rawHtml);
    const cleanUrl = (url?: string) => {
      if (!url) {
        return;
      }
      // exclude known bad urls
      if (exclude && !exclude.every((e) => !new RegExp(e, 'i').test(url.replace(domainExpr, '')))) {
        return;
      }
      // fix relative hrefs
      if (/^\//.test(url)) {
        return `${baseUrl}${url}`;
      } else
      if (/^https?:\/\//.test(url)) {
        // exclude external links
        if (!domainExpr.test(url)) {
          return;
        }
        return url;
      }
    };
    urls.push(...$(spider.selector).map((i, el) => cleanUrl($(el).attr(spider.attribute || 'href'))).filter(Boolean));
    await PuppeteerService.open(baseUrl, [
      {
        action: async (el) => {
          const url = cleanUrl(await el.evaluate((el, spider) => el.getAttribute(spider.attribute ?? 'href'), spider));
          if (url) {
            urls.push(url);
          }
        }, 
        selectAll: true,
        selector: spider.selector,
      },
    ]);
    return [...new Set(urls)].filter((url) => url.length < 2000);
  }

  public static async loot(
    url: string, 
    outlet: OutletCreationAttributes, 
    {
      content,
      exclude = [
        'img',
        'script',
        'source',
        'style',
      ],
    }: LootOptions = {}
  ): Promise<Loot> {
    
    const loot: Loot = {
      authors: [],
      content: content ?? '',
      date: new Date(0),
      dateMatches: [],
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
      return maxDate(...dates.map((date) => parseDate(clean(date))));
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
        exclude.forEach((tag) => $(tag).remove());
        
        const extract = (sel: string, attr?: string): string => {
          if (attr && clean($(sel)?.attr(attr))) {
            return clean($(sel).attr(attr));
          }
          return clean($(sel)?.text());
        };
        
        loot.content = extract(article.selector, article.attribute) || extract('h1,h2,h3,h4,h5,h6,p,blockquote');
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
        
        authors.push(...$(author.selector || 'author').map((i, el) => $(el).text()).get());
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
            exclude.forEach((tag) => $(tag).remove());
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
      
      loot.dateMatches = dates;
      loot.date = selectDate(dates);
      loot.authors = [...new Set(authors.map((a) => clean(a, /^\s*by:?\s*/i).split(/\s*(?:,|and)\s*/).flat()).flat().filter(Boolean))];
      
    }
    return loot;
  }

}