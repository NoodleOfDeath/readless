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
  imageUrl?: string;
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
      if (/^\/\//.test(url)) {
        return `https:${url}`;
      } else
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
    
    if (!content) {
      
      const {
        article, author, date, title, 
      } = outlet.selectors;
      
      const rawHtml = await PuppeteerService.fetch(url);
      
      const authors: string[] = [];
      const dates: string[] = [];
      
      if (rawHtml) {
        
        loot.rawText = rawHtml;
        const $ = load(rawHtml);
        
        const nextData = $('script#__NEXT_DATA__').text();
        if (nextData) {
          try {
            console.log(nextData.substring(0, 500));
            const match = nextData.match(/"date"[\s\n]*:[\s\n]*"(.*?)"/m);
            console.log(match);
            if (match) {
              dates.push(match[1]);
            }
          } catch (e) {
            console.error(e);
          }
        }
        
        exclude.forEach((tag) => $(tag).remove());
        
        const extract = (
          sel: string, 
          attr?: string,
          first?: boolean
        ): string => {
          if (attr && clean($(sel)?.attr(attr))) {
            if (first) {
              return clean($(sel)?.first()?.attr(attr));
            }
            return clean($(sel).attr(attr));
          }
          if (first) {
            return clean($(sel)?.first()?.text());
          }
          return $(sel)?.map((i, el) => clean($(el).text())).get().filter(Boolean).join(' ');
        };
        
        const extractAll = (sel: string, attr?: string): string[] => {
          return $(sel)?.map((i, el) => clean(attr ? $(el).attr(attr) : $(el).text())).get().filter(Boolean) ?? [];
        };
        
        loot.content = extract(article.selector, article.attribute) || extract('h1,h2,h3,h4,h5,h6,p,blockquote');
        loot.title = extract(title?.selector || 'title', title?.attribute);
        
        dates.push(
          ...extractAll(date.selector),
          ...extractAll(date.selector, 'datetime')
        );
        if (date.attribute) {
          dates.push(
            ...extractAll(date.selector, date.attribute),
            extract(date.selector, date.attribute)
          );
        }
        dates.push(
          extract(date.selector),
          extract(date.selector, 'datetime')
        );
        
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
            await el.evaluate((el) => { 
              if (el.childNodes.length > 1) {
                const parts: string[] = [];
                el.childNodes.forEach((n) => parts.push(n.textContent));
                return parts.join(' ');
              } else {
                return el.textContent; 
              }
            }),
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
      loot.date = maxDate(...dates.map((d) => parseDate(d)));
      if (!loot.date || Number.isNaN(loot.date.valueOf())) {
        loot.date = parseDate(dates.join(' '));
      }
      loot.authors = [...new Set(authors.map((a) => clean(a, /^\s*by:?\s*/i).split(/\s*(?:,|and)\s*/).flat()).flat().filter(Boolean))];
      
    }
    return loot;
  }

}