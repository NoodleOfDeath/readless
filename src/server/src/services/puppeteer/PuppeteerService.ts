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

import { PublisherCreationAttributes, SpiderSelector } from '../../api/v1/schema';
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

type UrlOptions = {
  publisher: PublisherCreationAttributes;
  spider?: SpiderSelector;
  baseUrl?: string;
  targetUrl?: string;
  excludeExternal?: boolean;
  removeQuery?: boolean;
};

export type Loot = {
  url: string;
  rawText: string;
  date: Date;
  dateMatches: string[];
  title: string;
  content: string;
  imageUrls?: string[];
  authors: string[];
};

export type LootOptions = {
  /** initial content if already fetched elsewhere */
  content?: string;
  /** selectors to remove from DOM */
  exclude?: string[];
};

const fallbackImageSelectors = [
  'article :not(header) figure picture img:not([src*=".svg"]):not([src*=".gif"]):not([src*="data:image"])',
  'article :not(header) figure picture source[type*="image"]:not([srcset*="image/webp"]):not([srcset*=".svg"]):not([srcset*=".gif"]):not([srcset*="data:image"])',
  'article :not(header) figure img:not([src*=".svg"]):not([src*=".gif"]):not([src*="data:image"]), article :not(header) picture img:not([src*=".svg"]):not([src*=".gif"]):not([src*="data:image"])',
  'article :not(header) figure source[type*="image"]:not([srcset*="image/webp"]):not([srcset*=".svg"]):not([srcset*=".gif"]):not([srcset*="data:image"])',
  'article :not(header) picture source[type*="image"]:not([srcset*="image/webp"]):not([srcset*=".svg"]):not([srcset*=".gif"]):not([srcset*="data:image"])',
  'article video',
  // dont grab just any images
  //'article :not(header) img:not([src*=".svg"]):not([src*=".gif"]), :not(header) figure img:not([src*=".svg"]):not([src*=".gif"])',
  //':not(header) picture img:not([src*=".svg"]):not([src*=".gif"]), :not(header) article img:not([src*=".svg"]):not([src*=".gif"])',
];

const fallbackImageAttributes = [
  'poster', // -- video thumbails
  'src',
  'data-gallery-src',
  'data-src',
  'srcset',
];

const MAX_IMAGE_COUNT = Number(process.env.MAX_IMAGE_COUNT || 3);

export function replaceDatePlaceholders(
  url: string
) {
  return url.replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
    const offset = Number($2 ?? 0) + Number($3 ?? 0);
    switch ($1) {
    case 'YYYY':
      return new Date(Date.now() + offset * ms('1y'))
        .getFullYear()
        .toString();
    case 'M':
      return (((new Date().getMonth() + offset) % 12) + 1).toString();
    case 'MM':
      return (((new Date().getMonth() + offset) % 12) + 1)
        .toString()
        .padStart(2, '0');
    case 'MMMM':
      return new Date(`2050-${((new Date().getMonth() + offset) % 12) + 1}-01`).toLocaleString('default', { month: 'long' });
    case 'D':
      return new Date(Date.now() + offset * ms('1d')).getDate().toString();
    case 'DD':
      return new Date(Date.now() + offset * ms('1d'))
        .getDate()
        .toString()
        .padStart(2, '0');
    default:
      return $0;
    }
  });
}

export function fixRelativeUrl(url: string, {
  publisher,
  targetUrl = publisher.baseUrl,
  excludeExternal,
  removeQuery,
}: UrlOptions) {
  const { baseUrl } = publisher;
  const domain = new URL(baseUrl).hostname.replace(/^www\./, '');
  const domainExpr = new RegExp(`^https?://(?:www\\.)?${domain}`);
  const baseDomain = `https://${new URL(targetUrl).hostname.replace(/\/*$/, '')}`;
  if (removeQuery) {
    url = url.replace(/\?.*$/, '');
  }
  // fix relative hrefs
  if (/^\/\//.test(url)) {
    return `https:${url}`;
  } else
  if (/^\//.test(url)) {
    return `${baseDomain}${url}`;
  } else
  if (/^\.\//.test(url)) {
    return `${targetUrl.replace(/\/.*?$/, '')}${url.replace(/^\./, '')}`;
  } else
  if (excludeExternal && /^https?:\/\//.test(url)) {
    // exclude external links
    if (!domainExpr.test(url)) {
      return '';
    }
  }
  return url;
}
  
export function parseSrcset(str: string, options: UrlOptions) {
  const splitSet = (srcset: string) => {
    const [path = '', widthStr = ''] = srcset.split(/\s+/);
    const widthSubstr = widthStr.replace(/[wx]/ig, '');
    const width = Number.isNaN(Number(widthSubstr)) ? undefined : Number(widthSubstr);
    if (path && width) {
      const url = fixRelativeUrl(path, options);
      return { url, width };
    }
  };
  if (/\S+\s+\d+[wx]\s*,/i.test(str)) {
    return str.split(/\s*,\s*/)
      .map((url) => splitSet(url))
      .filter(Boolean)
      .sort((a, b) => b.width - a.width)
      .map((img) => img.url)
      .filter(Boolean);
  }
  return [fixRelativeUrl(str, options)].filter(Boolean);
}

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
      timeout = process.env.PUPPETEER_TIMEOUT ? Number(process.env.PUPPETEER_TIMEOUT) : ms('5s'),
      viewport = { height: 1080, width: 1920 },
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
      await page.goto(url, { timeout, waitUntil : 'domcontentloaded' });
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
        try {
          if (selectAll) {
            const els = await page.$$(selector);
            for (const el of els) {
              await action(el);
            }
          } else {
            const el = await page.waitForSelector(selector, { timeout: pageOptions?.timeout ?? ms('3s') });
            await action(el);
          }
        } catch (e) {
          console.error(e);
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
  
  public static async crawlUrl(
    {
      publisher,
      spider = publisher.selectors.spider,
      baseUrl = publisher.baseUrl,
      targetUrl,
    }: UrlOptions,
    { exclude = this.EXCLUDE_EXPRS.depth1 }: LootOptions = {}
  ) {
    const domain = new URL(baseUrl).hostname.replace(/^www\./, '');
    const domainExpr = new RegExp(`^https?://(?:www\\.)?${domain}`);
    targetUrl = replaceDatePlaceholders(targetUrl);
    let urls: Record<string, number> = {};
    const rawHtml = await PuppeteerService.fetch(targetUrl);
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
      return fixRelativeUrl(url, { excludeExternal: true, publisher });
    };
    urls = Object.fromEntries([...$(replaceDatePlaceholders(spider.selector)).map((i, el) => {
      let priority = 0;
      let url: string;
      if (spider.urlSelector) {
        url = cleanUrl($(el).find(replaceDatePlaceholders(spider.urlSelector.selector)).first()?.attr(spider.urlSelector.attribute || spider.attribute || 'href'));
        if (!url) {
          return undefined;
        }
        if (spider.dateSelector) {
          const date = $(el).find(replaceDatePlaceholders(spider.dateSelector.selector)).first();
          const dates = [date?.attr(spider.dateSelector.attribute || spider.attribute || 'datetime'), date?.text()].filter(Boolean).map((d) => parseDate(d));
          priority = maxDate(...dates)?.valueOf() || 0;
        }
      } else {
        url = cleanUrl($(el).attr(spider.attribute || 'href'));
        if (!url) {
          return undefined;
        }
      }
      return { priority, url };
    })].filter(Boolean).map(({ priority, url }) => [url, priority]));
    await PuppeteerService.open(targetUrl, [
      {
        action: async (el) => {
          let priority = 0;
          let url: string;
          if (spider.urlSelector) {
            try {
              url = cleanUrl(await el.evaluate((el, selector, attr) => el.querySelector(selector)?.getAttribute(attr), replaceDatePlaceholders(spider.urlSelector.selector), spider.urlSelector.attribute || spider.attribute || 'href'));
              if (!url || url in urls) {
                return;
              }
            } catch (e) {
              console.error(e);
              return;
            }
            if (spider.dateSelector) {
              try {
                const date = await el.evaluate((el, selector) => el.querySelector(selector), replaceDatePlaceholders(spider.dateSelector.selector));
                const dates = [date?.getAttribute(spider.dateSelector.attribute || spider.attribute || 'datetime'), date?.textContent].filter(Boolean).map((d) => parseDate(d));
                if (dates.length > 0) {
                  priority = maxDate(...dates)?.valueOf() || 0;
                }
              } catch (e) {
                console.error(e);
              }
            }
          } else {
            url = cleanUrl(await el.evaluate((el, attr) => el.getAttribute(attr || 'href'), spider.attribute));
            if (!url || url in urls) {
              return;
            }
          }
          urls[url] = priority;
        }, 
        selectAll: true,
        selector: replaceDatePlaceholders(spider.selector),
      },
    ]);
    return Object.entries(urls).map(([url, priority]) => ({ priority, url })).sort((a, b) => b.priority - a.priority);
  }

  public static async crawl(
    publisher: PublisherCreationAttributes, 
    { exclude = this.EXCLUDE_EXPRS.depth1 }: LootOptions = {}
  ) {
    const {
      baseUrl, selectors: { spider }, sitemaps, 
    } = publisher;
    if (spider.selector === 'disabled') {
      return [];
    }
    if (sitemaps && sitemaps.length > 0) {
      return (await Promise.all(sitemaps.map(async (sitemap) => await this.crawlUrl({
        publisher,
        spider: sitemap.spider ?? spider,
        targetUrl: sitemap.url, 
      }, { exclude })))).flat();
    }
    return await this.crawlUrl({ 
      publisher,
      targetUrl: baseUrl,
    }, { exclude });
  }

  public static async loot(
    url: string, 
    publisher: PublisherCreationAttributes, 
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
        article, author, date, title, image,
      } = publisher.selectors;
      
      const rawHtml = await PuppeteerService.fetch(url);
      
      const authors: string[] = [];
      const dates: string[] = [];
      const imageUrls: string[] = [];
      
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

        // image
        for (const selector of [image?.selector, ...fallbackImageSelectors].filter(Boolean)) {
          for (const attr of [image?.attribute, ...fallbackImageAttributes].filter(Boolean)) {
            imageUrls.push(...extractAll(selector, attr).flatMap((src) => parseSrcset(src, { publisher, targetUrl: url })));
          }
        }
        
        exclude.forEach((tag) => $(tag).remove());
        
        // title
        loot.title = extract(title?.selector || 'title', title?.attribute);
        // content
        loot.content = article ? extract(article.selector, article.attribute) : extract('h1,h2,h3,h4,h5,h6,p,blockquote');
        
        // dates
        
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
        
        // authors
        authors.push(...$(author?.selector || 'author').map((i, el) => $(el).text()).get());
      }
      
      const actions: SelectorAction[] = [];
      
      // content
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
      
      // title
      if (!loot.title) {
        actions.push({
          action: async (el) => {
            loot.title = clean(await el.evaluate((el) => el.textContent));
          },
          selector: title?.selector || 'title',
        });
      }
      
      // image
      if (!loot.imageUrls || loot.imageUrls.length === 0) {
        for (const selector of [image?.selector, ...fallbackImageSelectors].filter(Boolean)) {
          actions.push({
            action: async (el) => {
              if (imageUrls.length >= MAX_IMAGE_COUNT) {
                return;
              }
              for (const attr of [image?.attribute, ...fallbackImageAttributes].filter(Boolean)) {
                const urls = parseSrcset(
                  await el.evaluate((el, attr) => {
                    return el.getAttribute(attr);
                  }, attr), 
                  { publisher, targetUrl: url }
                );
                imageUrls.push(...urls);
              }
            },
            selector,
          });
        }
      }
      
      // dates
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
      
      // ignore authors for now
      // authors
      /*actions.push({
        action: async (el) => {
          authors.push(...await el.evaluate((el) => {
            const names: string[] = [];
            el.childNodes.forEach((e) => names.push(e.textContent));
            return names;
          }));
        },
        selector: author?.selector,
      });*/
      
      await PuppeteerService.open(url, actions);
      
      loot.dateMatches = dates;
      loot.date = maxDate(...dates.map((d) => parseDate(d)));
      if (!loot.date || Number.isNaN(loot.date.valueOf())) {
        loot.date = parseDate(dates.join(' '));
      }
      loot.authors = [...new Set(authors.map((a) => clean(a, /^\s*by:?\s*/i).split(/\s*(?:,|and)\s*/).flat()).flat().filter(Boolean))];
      loot.imageUrls = Array.from(new Set(imageUrls.filter((url) => url && !/\.(gif|svg)/i.test(url)))).slice(0, MAX_IMAGE_COUNT);
      
    }
    return loot;
  }

}