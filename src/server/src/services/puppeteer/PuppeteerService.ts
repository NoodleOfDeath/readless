import axios from 'axios';
import ms from 'ms';
import puppeteer, {
  Browser,
  ElementHandle,
  PuppeteerLifeCycleEvent,
  Viewport,
  WaitForSelectorOptions,
} from 'puppeteer';
import UserAgent from 'user-agents';

import {
  UrlOptions,
  clean,
  fixRelativeUrl,
  parseSrcset,
  replaceDatePlaceholders,
} from './utils';
import { PublisherCreationAttributes } from '../../api/v1/schema';
import { maxDate, parseDate } from '../../utils';
import { BaseService } from '../base';

export type PageOptions = WaitForSelectorOptions & {
  viewport?: Viewport;
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
}; 

export type SelectorAction = {
  selector: string;
  action: (el: ElementHandle<Element>) => Promise<void>;
  finally?: () => void;
  firstMatchOnly?: boolean;
  pageOptions?: PageOptions;
};

export type FetchOptions = {
  usePuppet?: boolean;
  pageOptions?: PageOptions;
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

export class PuppeteerError extends Error {

  url: string;
  status: number;
  
  constructor(url: string, status: number) {
    super(`Bad response ${status} connecting to ${url}`);
  }

}

const SELECTORS = {
  article: 'h1,h2,h3,h4,h5,h6,p,blockquote',
  image: [
    'article :not(header) figure picture img:not([src*=".svg"]):not([src*=".gif"])',
    'article :not(header) figure picture source:not([srcset*=".svg"]):not([srcset*=".gif"])',
    'article :not(header) figure img:not([src*=".svg"]):not([src*=".gif"]), article :not(header) picture img:not([src*=".svg"]):not([src*=".gif"])',
    'article :not(header) figure source:not([srcset*=".svg"]):not([srcset*=".gif"])',
    'article :not(header) picture source:not([srcset*=".svg"]):not([srcset*=".gif"])',
    'article video',
    // dont grab just any images
    //'article :not(header) img:not([src*=".svg"]):not([src*=".gif"]), :not(header) figure img:not([src*=".svg"]):not([src*=".gif"])',
    //':not(header) picture img:not([src*=".svg"]):not([src*=".gif"]), :not(header) article img:not([src*=".svg"]):not([src*=".gif"])',
  ],
};

const ATTRIBUTES = {
  a: 'href',
  date: ['datetime', 'data-datetime'],
  image: [
    'poster', // -- video thumbails
    'src',
    'data-gallery-src',
    'data-src',
    'srcset',
  ],
};

const MAX_IMAGE_COUNT = Number(process.env.MAX_IMAGE_COUNT || 3);

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

  /** 
   * Simply fetches the raw text of a url without using a puppet. Equivalent to cURL 
   * @param url the url to fetch
   * @param usePuppet whether to use a puppet to fetch the url
   * @param pageOptions options to pass to the puppet
   */
  static async fetch(url: string, { usePuppet, pageOptions }: FetchOptions = {}) {
    if (usePuppet) {
      try {
        return await this.open(url, [], pageOptions);
      } catch (e) {
        if (process.env.ERROR_REPORTING) {
          console.error(e);
        }
      }
    }
    try {
      const { data: text, status } = await axios.get(url, {
        headers: { 
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'User-Agent': new UserAgent().random().toString(),
        }, 
      });
      if (status !== 200) {
        throw new Error(`Status ${status}`);
      }
      return text;
    } catch (e) {
      if (process.env.ERROR_REPORTING) {
        console.error(e);
      }
    }
  }

  /**
   * Opens a url in a puppet and performs actions on the page
   * @param {string} url the url to open
   * @param {SelectorAction[]} actions actions to perform on the page
   * @param {PageOptions} pageOptions options to pass to the puppet
   * @returns {Promise<string>} the raw text of the page
   * @throws if the page fails to load
   */
  public static async open(
    url: string, 
    actions: SelectorAction[] = [], 
    { 
      timeout = process.env.PUPPETEER_TIMEOUT ? Number(process.env.PUPPETEER_TIMEOUT) : ms('5s'),
      viewport = { height: 1080, width: 1920 },
      waitUntil = 'domcontentloaded',
    }: PageOptions = {}
  ): Promise<string> {

    let browser: Browser;
    try {
      
      browser = await puppeteer.launch({
        args: ['--no-sandbox'], 
        executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, 
        timeout, 
      });
      
      const page = await browser.newPage();
      await page.setViewport(viewport);
      
      // handle pages that might lag to load content
      console.log(`waiting for ${waitUntil} events to fire...`);
      const response = await page.goto(url, { timeout, waitUntil });
      const status = await response.status();
      
      if (status >= 400) {
        throw new PuppeteerError(url, status);
      }

      const rawText = await page.evaluate(() => document.body.innerText);

      for (const selectorAction of actions) {
        try {
          const {
            selector, firstMatchOnly, pageOptions, action, 
          } = selectorAction;
          if (selector === 'disabled') {
            return '';
          }
          await page.setViewport(pageOptions?.viewport ?? viewport);
          if (firstMatchOnly) {
            const el = await page.waitForSelector(selector, { timeout: pageOptions?.timeout ?? ms('3s') });
            await action(el);
          } else {
            const els = await page.$$(selector);
            await Promise.all(els.map(async (el) => await action(el)));
          }
          selectorAction.finally?.();
        } catch (e) {
          if (process.env.ERROR_REPORTING) {
            console.error(e);
          }
        }
      }

      return rawText;
      
    } catch (e) {
      if (e instanceof PuppeteerError) {
        throw e;
      }
      if (process.env.ERROR_REPORTING) {
        console.error(e);
      }
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
    const urls: Record<string, { priority: number, imageUrls: string[] }> = {};
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
    const topSelector = replaceDatePlaceholders(spider.selector);
    await this.open(targetUrl, [
      {
        action: async (el) => {
          let priority = 0;
          let url: string;
          let imageUrls: string[];
          try {
            if (/\ba(?:\[.*?\])?$/.test(topSelector)) {
              url = cleanUrl(await el.evaluate((el, attr) => el.getAttribute(attr || 'href'), spider.attribute));
              if (!url || url in urls) {
                return;
              }
            } else {
              url = cleanUrl(await el.evaluate((el, selector, attr) => el.querySelector(selector)?.getAttribute(attr), replaceDatePlaceholders(spider.urlSelector?.selector || 'a'), spider.urlSelector?.attribute || spider.attribute || 'href'));
              if (!url || url in urls) {
                return;
              }
            }
          } catch (e) {
            if (process.env.ERROR_REPORTING) {
              console.error(e);
            }
            return;
          }
          if (spider.dateSelector?.selector) {
            try {
              const strs = await el.evaluate((el, selector, attr) => {
                const date = el.querySelector(selector);
                if (!date) {
                  return;
                }
                return [date.getAttribute(attr), date.textContent];
              }, replaceDatePlaceholders(spider.dateSelector.selector), spider.dateSelector.attribute || spider.attribute || 'datetime');
              const dates = strs.filter(Boolean).map((d) => parseDate(d));
              if (dates.length > 0) {
                priority = maxDate(...dates)?.valueOf() || 0;
              }
            } catch (e) {
              if (process.env.ERROR_REPORTING) {
                console.error(e);
              }
            }
          }
          try {
            imageUrls = (await el.evaluate((el, selector, ATTRIBUTES) => {
              const image = el.querySelector(selector);
              return image ? ATTRIBUTES.image.map((attr) => image.getAttribute(attr)).filter(Boolean) : [];
            }, replaceDatePlaceholders(spider.imageSelector?.selector ?? 'img'), ATTRIBUTES)).flatMap((src) => parseSrcset(src, { publisher, targetUrl }));
            console.log(`found ${imageUrls.length} images for ${url}`);
          } catch (e) {
            if (process.env.ERROR_REPORTING) {
              console.error(e);
            }
          }
          urls[url] = { imageUrls, priority };
        }, 
        selector: topSelector,
      },
    ], { waitUntil: publisher.fetchPolicy?.waitUntil });
    return Object.entries(urls).map(([url, data]) => ({ ...data, url })).sort((a, b) => b.priority - a.priority);
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
    { content }: LootOptions = {}
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
    
    const {
      article, date, title, image,
    } = publisher.selectors;
      
    const authors: string[] = [];
    const dates: string[] = [];
    const imageUrls: string[] = [];
    const actions: SelectorAction[] = [];
      
    // content
    if (!loot.content) {
      const parts: string[] = [];
      for (const selector of [article?.selector, SELECTORS.article].filter(Boolean)) {
        actions.push({
          action: async (el) => {
            const text = (await el.evaluate((el) => el.textContent.trim() || el.innerHTML)).replace(/\n/g, '').replace(/\s+/g, ' ').trim();
            parts.push(text);
          },
          finally: () => {
            loot.content = parts.filter(Boolean).join('\n');
          },
          selector,
        });
      }
    }
      
    // title
    if (!loot.title) {
      actions.push({
        action: async (el) => {
          loot.title = clean(await el.evaluate((el) => el.textContent));
        },
        firstMatchOnly: true,
        selector: title?.selector || 'title',
      });
    }
      
    // image
    if (!loot.imageUrls || loot.imageUrls.length === 0) {
      for (const selector of [image?.selector, ...SELECTORS.image].filter(Boolean)) {
        actions.push({
          action: async (el) => {
            console.log(`testing image selector ${selector.slice(0, 20)}...`);
            if (imageUrls.length >= MAX_IMAGE_COUNT) {
              return;
            }
            for (const attr of [image?.attribute, ...ATTRIBUTES.image].filter(Boolean)) {
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
    const dateSelectors = [date.selector, 'article time'];
    if (date.firstOnly) {
      dateSelectors.push(SELECTORS.article);
    }
    for (const selector of dateSelectors) {
      actions.push({
        action: async (el) => {
          dates.push(
            await el.evaluate((el) => { 
              if (el.childNodes.length > 1) {
                const parts: string[] = [];
                el.childNodes.forEach((n) => parts.push(n.textContent.trim()));
                return parts.join(' ');
              } else {
                return el.textContent.trim();
              }
            }),
            await el.evaluate((el) => el.getAttribute('datetime'))
          );
          if (date.attribute) {
            dates.push(
              await el.evaluate((el, attr) => el.getAttribute(attr), date.attribute)
            );
          }
        },
        firstMatchOnly: !date.firstOnly,
        selector,
      });
    }
      
    await this.open(url, actions, { waitUntil: publisher.fetchPolicy?.waitUntil });
      
    loot.dateMatches = dates.filter(Boolean);
    loot.date = maxDate(...dates);
    if (!loot.date || Number.isNaN(loot.date.valueOf())) {
      loot.date = parseDate(dates.join(' '));
    }
    loot.authors = [...new Set(authors.map((a) => clean(a, /^\s*by:?\s*/i).split(/\s*(?:,|and)\s*/).flat()).flat().filter(Boolean))];
    loot.imageUrls = Array.from(new Set(imageUrls.filter((url) => url && !/\.(gif|svg)/i.test(url)))).slice(0, MAX_IMAGE_COUNT);
      
    return loot;
  }

}