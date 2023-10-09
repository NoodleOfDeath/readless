import { PuppeteerLifeCycleEvent } from 'puppeteer';

import { DatedAttributes } from '../../types';
import { Sentimental } from '../sentiment/Sentiment.types';

export type FetchPolicy = {
  /** indicate if the website needs to be scraped after a certain amount of time, default is `domcontentloaded` to avoid paywalls */
  timeout?: string | number;
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
  fetchRate?: string | number;
};

export type Selector = {
  selector: string;
  exclude?: string[];
  attribute?: string;
  firstOnly?: boolean;
};

export type SpiderSelector = Selector & {
  dateSelector?: Selector;
  imageSelector?: Selector;
  urlSelector?: Selector;
};

export type Selectors = {
  article?: Selector;
  author?: Selector;
  date: Selector;
  spider: SpiderSelector;
  image?: Selector;
  title?: Selector;
};

export type Sitemap = {
  url: string;
  spider?: SpiderSelector;
};

export type PublisherAttributes = DatedAttributes & Sentimental & {
  baseUrl: string;
  name: string;
  sitemaps: Sitemap[],
  displayName: string;
  imageUrl?: string;
  description?: string;
  selectors: Selectors;
  geolocation?: string;
  radius?: string;
  maxAge: string;
  fetchPolicy?: FetchPolicy;
  lastFetchedAt?: Date;
  lastStatusCode?: number;
  failureCount?: number;
  delayedUntil?: Date;
  timezone: string;
  disabled?: boolean;
};

export type PublisherCreationAttributes = Partial<DatedAttributes & Sentimental> & {
  baseUrl: string;
  name: string;
  sitemaps?: Sitemap[];
  displayName: string;
  imageUrl?: string;
  description?: string;
  selectors: Selectors;
  geolocation?: string;
  radius?: string;
  maxAge?: string;
  fetchPolicy?: FetchPolicy;
  lastFetchedAt?: Date;
  lastStatusCode?: number;
  failureCount?: number;
  delayedUntil?: Date;
  timezone?: string;
  disabled?: boolean;
};

const TIMEZONES = {
  default: process.env.DEFAULT_TIMEZONE || 'EST',
  uk: 'UTC+1',
};

export const PUBLIC_PUBLISHER_ATTRIBUTES = [
  'name',
  'displayName',
  'imageUrl',
  'description',
] as const;

export type PublicPublisherAttributes = Sentimental & {
  name: string;
  displayName: string;
  imageUrl?: string;
  description?: string;
};

export const PUBLISHERS: Record<string, PublisherCreationAttributes> = {
  _9to5google: {
    baseUrl: 'https://9to5google.com',
    displayName: '9to5google',
    geolocation: 'Mountain View, California, United States',
    name: '9to5google',
    selectors: {
      article: { selector: '#river p' },
      author: { selector: '#main .author-name' },
      date: { selector: 'main .container.left .post-meta' },
      image: { selector: 'article amp-img, article figure img, figure img' },
      spider: {
        attribute: 'href',
        selector: 'a[class*="article__title"], article a',
      },
    },
  },
  _9to5mac: {
    baseUrl: 'https://9to5mac.com',
    displayName: '9to5mac',
    geolocation: 'Cupertino, California, United States',
    name: '9to5mac',
    selectors: {
      article: { selector: '#river p' },
      author: { selector: '#main .author-name' },
      date: { selector: '#main .post-meta' },
      image: { selector: 'article amp-img, article figure img, figure img' },
      spider: {
        attribute: 'href',
        selector: 'a[class*="article__title"]',
      },
    },
  },
  abcnews: {
    baseUrl: 'https://abcnews.go.com',
    displayName: 'ABC News',
    geolocation: 'Manhattan, New York, United States',
    name: 'abcnews',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '.ShareByline a[href*="/author/"]' },
      date: { selector: '.ShareByline > div  > div :last-child, div[data-testid*="prism-byline"]' },
      spider: {
        attribute: 'href',
        dateSelector: { selector: '.ContentRoll__TimeStamp, .ContentRoll__Date' },
        selector: '.ContentRoll [class*="ContentRoll__Item"]',
        urlSelector: { selector: '.ContentRoll__Headline a' },
      },
    },
    sitemaps: [
      { url: 'https://abcnews.go.com/Entertainment' },
      { url: 'https://abcnews.go.com/Technology' },
      { url: 'https://abcnews.go.com/Lifestyle' },
      { url: 'https://abcnews.go.com/US' },
      { url: 'https://abcnews.go.com/Sports' },
      { url: 'https://abcnews.go.com/International' },
      { url: 'https://abcnews.go.com/Politics' },
      { url: 'https://abcnews.go.com/Health' },
      { url: 'https://abcnews.go.com/Travel' },
      { url: 'https://abcnews.go.com/WhatWouldYouDo' },
    ],
    timezone: TIMEZONES.default,
  },
  advocate: {
    baseUrl: 'https://www.advocate.com',
    displayName: 'Advocate',
    geolocation: 'Los Angeles, California, United States',
    name: 'advocate',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .social-author' },
      date: { selector: 'article .social-date' },
      spider: { 
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  aei: {
    baseUrl: 'https://www.aei.org',
    disabled: true,
    displayName: 'AEI',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'aei',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header .author' },
      date: { selector: 'article header .date' },
      spider:{
        attribute: 'href',
        selector: '.post .post__title a',
      },
    },
    timezone: TIMEZONES.default,
  },
  apnews: {
    baseUrl: 'https://apnews.com',
    displayName: 'AP News',
    geolocation: 'New York, New York, United States',
    name: 'apnews',
    selectors: {
      article: { selector: '.Content .Article p' },
      author: { selector: '.Content .CardHeadline *[class*="Component-bylines"]' },
      date: { attribute: 'data-timestamp', selector: '.Page-byline bsp-timestamp' },
      image: { selector: 'img.Image.flickity-lazyloaded' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/article/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  arstechnica: {
    baseUrl: 'https://www.arstechnica.com',
    displayName: 'ars technica',
    name: 'arstechnica',
    geolocation: 'New York City, New York, United States',
    selectors: {
      article:{ selector: 'article p' }, 
      author: { selector: 'article header section *[itemprop*="author creator"] a' },
      date: { selector: 'article header time,article header .date' },
      spider: {
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  axios: {
    baseUrl: 'https://www.axios.com',
    displayName: 'Axios',
    geolocation: 'Arlington, Virginia, United States',
    name: 'axios',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/authors/"]' },
      date: { selector: 'span[data-cy*="time-rubric"]' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/${YYYY}/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  barrons: {
    baseUrl: 'https://www.barrons.com/real-time',
    displayName: 'Barron\'s',
    geolocation: 'New York City, New York, United States',
    name: 'barrons',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline .author' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'a[class*="headline-link"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  bbc: {
    baseUrl: 'https://www.bbc.com',
    displayName: 'BBC',
    geolocation: 'London, United Kingdom',
    name: 'bbc',
    selectors: { 
      article: { selector: 'article p' },
      author: { selector: 'article *[class*="TextContributorName"], .author-unit' },
      date: { selector: 'article time, .author-unit' },
      spider:{ attribute: 'href', selector: 'a[class*="media__link"]' }, 
    },
    timezone: TIMEZONES.uk,
  },
  billboard: {
    baseUrl: 'https://www.billboard.com',
    displayName: 'billboard',
    geolocation: 'New York City, New York, United States',
    name: 'billboard',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'header .author a' },
      date: { selector: 'header time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/music/"]', 
          'a[href*="/lists/"]', 
          'a[href*="/culture/"]', 
          'a[href*="/media/"]', 
          'a[href*="/business/"]', 
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  bleepingcomputer: {
    baseUrl: 'https://www.bleepingcomputer.com',
    displayName: 'Bleeping Computer',
    geolocation: 'Huntington Station, New York, United States',
    name: 'bleepingcomputer',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author' },
      date: { selector: 'article .cz-news-date,article .cz-news-time' },
      spider:{
        attribute: 'href',
        selector: '.bc_latest_news_img a, #pop-stories li a',
      },
    },
    timezone: TIMEZONES.default,
  },
  bloomberg: {
    baseUrl: 'https://www.bloomberg.com',
    disabled: true,
    displayName: 'Bloomberg',
    geolocation: 'New York City, New York, United States',
    name: 'bloomberg',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'address p[class*="author/"] a' },
      date: { selector: 'article [class*="Byline_"] time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/articles/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  businessinsider: {
    baseUrl: 'https://www.businessinsider.com',
    displayName: 'Business Insider',
    fetchPolicy: { timeout: '10s' },
    geolocation: 'New York City, New York, United States',
    name: 'businessinsider',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '.byline .byline-author-name' },
      date: { selector: '.byline .byline-timestamp' },
      image: { selector: 'figure img[src*="i.insider.com"]' },
      spider: {
        attribute: 'href',
        selector: 'a[href^="/"]',
      },
    },
    sitemaps: [
      {
        spider: {
          dateSelector: { selector: '_' },
          selector: 'p',
        },
        url: 'https://www.businessinsider.com/sitemap/html/${YYYY}-${MM}.html',
      },
    ],
    timezone: TIMEZONES.default,
  },
  bustle: {
    baseUrl: 'https://www.bustle.com',
    displayName: 'Bustle',
    geolocation: 'Park Avenue South, New York, United States',
    name: 'bustle',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'address a' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/entertainment/"]', 
          'a[href*="/style/"]', 
          'a[href*="/wellness/"]', 
          'a[href*="/lifestyle/"]', 
          'a[href*="/rule-breakers/"]', 
          'a[href*="/originals/"]', 
          'a[href*="/amplifying-our-voices/"]', 
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  buzzfeed: {
    baseUrl: 'https://www.buzzfeed.com',
    displayName: 'BuzzFeed',
    geolocation: 'New York City, New York, United States',
    name: 'buzzfeed',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author a' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: [
          '*[class*="feedItem_textWrapper"] a',
          'li[class*="carousel_itemWrapper"] a',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  cbsnews: {
    baseUrl: 'https://www.cbsnews.com',
    displayName: 'CBS News',
    geolocation: 'New York City, New York, United States',
    name: 'cbsnews',
    selectors: {
      article: { selector: 'article p' },
      author : { selector: '' },
      date: { selector: 'article time' },
      spider:{ attribute: 'href', selector: 'a[href*="/news/"]' },
    },
    timezone: TIMEZONES.default,
  },
  cnbc: {
    baseUrl: 'https://www.cnbc.com',
    displayName: 'CNBC',
    geolocation: 'Englewood Cliffs, New Jersey, United States',
    name: 'cnbc',
    selectors: {
      article: { selector: '.ArticleBody-articleBody p' },
      author: { selector: '.Author-authorName' },
      date: { selector: 'time' },
      image: { selector: '[class*="ArticleBody"] [class*="InlineImage"] picture img' },
      spider:{
        attribute: 'href',
        selector: [
          '.LatestNews-headlineWrapper a',
          '.RiverHeadline-headline a',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  cnn: {
    baseUrl: 'https://www.cnn.com',
    displayName: 'CNN',
    geolocation: 'Atlanta, Georgia, United States',
    name: 'cnn',
    selectors: {
      author: { selector: '.headline__sub-text .byline_name' },
      date: { selector: '.headline__sub-text .timestamp' },
      spider:{
        attribute: 'href',
        selector: 'a[data-link-type="article"]',
      },
    },
    sitemaps: [
      {
        spider: { 
          dateSelector: { selector: '.date' },
          selector: '.sitemap-entry ul li',
          urlSelector: { selector: '.sitemap-link a' },
        },
        url: 'https://www.cnn.com/article/sitemap-${YYYY}-${M}.html',
      },
    ],
    timezone: TIMEZONES.default,
  },
  coindesk: {
    baseUrl: 'https://www.coindesk.com',
    displayName: 'CoinDesk',
    geolocation: 'Broadway, New York, United States',
    name: 'coindesk',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .at-authors a' },
      date: { selector: 'article .at-created,article .at-updated' },
      spider:{
        attribute: 'href',
        selector: 'a.card-title-link',
      },
    },
    timezone: TIMEZONES.default,
  },
  cryptoglobe: {
    baseUrl: 'https://www.cryptoglobe.com',
    displayName: 'Cryptoglobe',
    geolocation: 'London, United Kingdom',
    name: 'cryptoglobe',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header .media-body a[href*="/contributors"]' },
      date: { selector: 'article header .media-body .d-block > ul > li' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/latest/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  csis: {
    baseUrl: 'https://www.csis.org',
    displayName: 'CSIS',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'csis',
    selectors: {
      article: { selector: 'div[role*="article"] .column p' },
      author: { selector: 'article .contributors a' },
      date: { selector: 'article .contributors :last-child, main .mb-md, article header' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  cultofmac: {
    baseUrl: 'https://www.cultofmac.com',
    displayName: 'Cult of Mac',
    geolocation: 'San Francisco, California, United States',
    name: 'cultofmac',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author a[class*="/author/"]' },
      date: { selector: 'article .author time' },
      spider:{
        attribute: 'href',
        selector: 'a[class*="post-title"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  dailymail: {
    baseUrl: 'https://www.dailymail.co.uk/ushome/index.html',
    displayName: 'Daily Mail',
    geolocation: 'Kensington, London, United Kingdom',
    name: 'dailymail',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author, .author' },
      date: { selector: 'article .date time, .article-timestamp time' },
      image: { attribute: 'data-gallery-src', selector: 'article figure img[data-gallery-src*=".jpg"]' },
      spider:{
        attribute: 'href',
        selector: [
          '.article .articletext a',
          'a[href*="/news/"]',
          'a[href*="/article"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.uk,
  },
  daringfireball: {
    baseUrl: 'https://www.daringfireball.net',
    displayName: 'Daring Fireball',
    geolocation: 'Philadelphia, Pennsylvania, United States',
    name: 'daringfireball',
    selectors: {
      article: { selector: '.article p' },
      author: { selector: '.article .dateline' },
      date: { selector: '.article .dateline, #Main .smallprint' },
      spider:{
        attribute: 'href',
        selector: [
          '.article a',
          'a[href*="/${YYYY}/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  defenseone: {
    baseUrl: 'https://www.defenseone.com',
    displayName: 'Defense One',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'defenseone',
    selectors: {
      article: { selector: 'div[role*="article"] .column' },
      author: { selector: 'article .contributors a, a[href*="/voices/"]' },
      date: { selector: 'article .contributors :last-child, time' },
      image: { selector: 'header img' },
      spider:{
        attribute: 'href',
        selector: [
          'a.skybox-link',
          'a[class*="hed-link"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  developertech: {
    baseUrl: 'https://www.developer-tech.com',
    displayName: 'Developer Tech',
    geolocation: 'Bristol, London, United Kingdom',
    name: 'developer-tech',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline .by a' },
      date: { selector: 'article .byline time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/news/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  digitaltrends: {
    baseUrl: 'https://www.digitaltrends.com',
    displayName: 'digitaltrends',
    geolocation: 'Portland, Oregon, United States',
    name: 'digitaltrends',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'cite a[href*="/users/"], cite a.author' },
      date: { selector: 'cite time.date, cite time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/cars/"]',
          'a[href*="/computing/"]',
          'a[href*="/entertainment/"]',
          'a[href*="/gaming/"]',
          'a[href*="/mobile/"]',
          'a[href*="/movies/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  economist: {
    baseUrl: 'https://www.economist.com',
    disabled: true,
    displayName: 'The Economist (Coming Soon)',
    geolocation: 'London, United Kingdom',
    name: 'economist',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector: 'disabled' },
      spider : { selector: 'disabled' },
    },
    timezone: TIMEZONES.default,
  },
  enews: {
    baseUrl: 'https://www.eonline.com',
    displayName: 'E! News',
    geolocation: 'New York, New York, United States',
    name: 'enews',
    selectors: {
      article: { selector: '.article-detail__text-only p' },
      author: { selector: 'header .article-detail__meta__author' },
      date: { selector: 'header .article-detail__meta__date' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/news/"]',
      },
    },
    timezone: 'UTC-7',
  },
  engadget: {
    baseUrl: 'https://www.engadget.com/',
    displayName: 'Engadget',
    geolocation: '22000 Aol Way, Dulles, Virginia, 20166, United States',
    name: 'engadget',
    selectors: {
      article: { selector: 'main section .article-text' },
      date: { selector: 'main [data-component*="HorizontalAuthor"]' },
      image: { selector: 'main figure img' },
      spider:{
        attribute: 'href',
        selector: 'article h2 a',
      },
    },
    timezone: 'UTC-4',
  },
  espn: {
    baseUrl: 'https://www.espn.com',
    displayName: 'ESPN',
    geolocation: 'Bristol, Connecticut, United States',
    name: 'espn',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .authors .author' },
      date: { attribute: 'data-date', selector: 'article .timestamp' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/story/"]',
          'a[href*="/post/"]',
          'a[href*="/blog/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  essence: {
    baseUrl: 'https://www.essence.com',
    displayName: 'Essence',
    geolocation: 'Brooklyn, New York, United States',
    name: 'essence',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header .byline .author a' },
      date: { selector: 'article .posted-on time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[class*="topic__link"]',
          'a[class*="story__anchor"]',
          'a[href*="/celebrity/"]',
          'a[href*="/fashion/"]',
          'a[href*="/story/"]',
          'a[href*="/beauty/"]',
          'a[href*="/hair/"]',
          'a[href*="/love/"]',
          'a[href*="/lifestyle/"]',
          'a[href*="/news/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  ew: {
    baseUrl: 'https://www.ew.com',
    displayName: 'Entertainment Weekly',
    geolocation: 'New York City, New York, United States',
    name: 'ew',
    selectors: {
      article: { selector: 'main > .longformContent, article p' },
      author: { selector: 'article a.author-name' },
      date: { selector: '.byline__block--timestamp' },
      spider:{
        attribute: 'href',
        selector: 'a.entityTout__link',
      },
    },
    timezone: TIMEZONES.default,
  },
  fiercebiotech: {
    baseUrl: 'https://www.fiercebiotech.com',
    disabled: true,
    displayName: 'Fierce Biotech',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'fiercebiotech',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline a[href*="/person/"]' },
      date: { selector: 'article .byline .date' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/biotech/"]',
          'a[href*="/cro/"]',
          'a[href*="/medtech/"]',
          'a[href*="/research/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  forbes: {
    baseUrl: 'https://www.forbes.com',
    displayName: 'Forbes',
    geolocation: 'Jersey City, New Jersey, United States',
    name: 'forbes',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .fs-author-name a' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/sites/"]',
      },
    },
    timezone: 'EDT',
  },
  foreignpolicy: {
    baseUrl: 'https://www.foreignpolicy.com',
    displayName: 'Foreign Policy',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'foreignpolicy',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author-bio a[rel*="author/"]' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: 'a[class*="hed-heading"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  fortune: {
    baseUrl: 'https://www.fortune.com',
    displayName: 'Fortune',
    geolocation: 'New York City, New York, United States',
    name: 'fortune',
    selectors: {
      article: { selector: '#article-content p' },
      author: { selector: '#content a[href*="/author/"]' },
      date: { selector: '#content' },
      image: { selector: '#content img[src*="content.fortune.com"]' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/${YYYY}/"]',
      },
    },
    timezone: 'EDT',
  },
  foxnews: {
    baseUrl: 'https://www.foxnews.com',
    displayName: 'Fox News',
    geolocation: 'New York City, New York, United States',
    name: 'foxnews',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header .author-byline a[href*="/person"]' },
      date: { selector: 'article header time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  ft: {
    baseUrl: 'https://www.ft.com',
    disabled: true,
    displayName: 'Financial Times',
    geolocation: 'London, United Kingdom',
    name: 'ft',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector: 'disabled' },
      spider : { selector: 'disabled' },
    },
    timezone: TIMEZONES.default,
  },
  futurism: {
    baseUrl: 'https://www.futurism.com',
    displayName: 'Furturism',
    geolocation: 'Brooklyn, New York, United',
    name: 'futurism',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'a[href*="/authors/"]' },
      date: { selector: 'script#__NEXT_DATA__' },
      spider:{
        attribute: 'href',
        selector: [
          'article a',
          'a[href*="/the-byte/"]',
          'a[href*="/neoscope/"]',
          'a[href*="/latest/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  gizmodo: {
    baseUrl: 'https://www.gizmodo.com', 
    displayName: 'Gizmodo',
    geolocation: 'New York City, New York, United States',
    name: 'gizmodo',
    selectors: {
      article: { selector: '.js_post-content p' },
      author: { selector: 'a[href*="/author/"]' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  huffpost: {
    baseUrl: 'https://www.huffpost.com',
    displayName: 'HuffPost',
    geolocation: 'Broadway, New York City, United States',
    name: 'huffpost',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'main header .entry__wirepartner span' },
      date: { selector: 'main header time' },
      image: { selector: 'main img[class*="connatix-thumbnail"]' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/entry/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  ieeespectrum: {
    baseUrl: 'https://spectrum.ieee.org',
    displayName: 'IEEE Spectrum',
    geolocation: 'New York City, New York, United States',
    name: 'ieeespectrum',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .social-author a' },
      date: { selector: 'article .social-date' },
      spider:{
        attribute: 'href',
        selector: [
          'a[class*="widget__headline-text"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  independent: {
    baseUrl: 'https://www.independent.co.uk/',
    displayName: 'The Independent',
    geolocation: 'London, United Kingdom',
    name: 'independent',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/author/"]' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/asia/"]',
          'a[href*="/extras/"]',
          'a[href*="/lifestyle/"]',
          'a[href*="/life-style/"]',
          'a[href*="/news/"]',
          'a[href*="/pride-month/"]',
          'a[href*="/space/"]',
          'a[href*="/sport/"]',
          'a[href*="/tech/"]',
          'a[href*="/travel/"]',
          'a[href*="/voices/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.uk,
  },
  inews: {
    baseUrl: 'https://inews.co.uk',
    displayName: 'inews',
    geolocation: 'Northcliffe House, London, England',
    name: 'inews',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/author/"]' },
      date: { selector: 'article .inews__post__pubdate' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/news/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  inverse: {
    baseUrl: 'https://www.inverse.com',
    displayName: 'Inverse',
    geolocation: 'New York City, New York, United States',
    name: 'inverse',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'address a' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/culture/"]',
          'a[href*="/entertainment/"]',
          'a[href*="/gaming/"]',
          'a[href*="/science/"]',
          'a[href*="/tech/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  investors: {
    baseUrl: 'https://www.investors.com/tag/all-news-and-stock-ideas/',
    displayName: 'Investors\'s Business Daily',
    geolocation: 'Los Angeles, California, United States',
    name: 'investors',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'a[href*="/author/"]' },
      date: { selector: 'article header .post-time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/news/"]',
          'a[href*="/stock-lists/"]',
          'a[href*="/research/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  jalopnik: {
    baseUrl: 'https://jalopnik.com/sitemap/${YYYY}/${MMMM}',
    displayName: 'Jalopnik',
    geolocation: 'Durham, North Carolina, United States',
    name: 'jalopnik',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'a[href*="/author/"]' },
      date: { selector: 'main time, time' },
      spider:{
        attribute: 'href',
        selector: 'a',
      },
    },
    timezone: TIMEZONES.default,
  },
  kotaku: {
    baseUrl: 'https://www.kotaku.com',
    displayName: 'Kotaku',
    geolocation: 'Surry Hills, New South Wales, Australia',
    name: 'kotaku',
    selectors: {
      article: { selector: 'main p' },
      author: { selector: 'main a[href*="/author/"]' },
      date: { selector: 'main time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  ksl: {
    baseUrl: 'https://www.ksl.com',
    displayName: 'KSL',
    geolocation: 'Salt Lake City, Utah, United States',
    name: 'ksl',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '.story .byline .author' },
      date: { selector: '.story .byline .author' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/article/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  latimes: {
    baseUrl: 'https://www.latimes.com',
    displayName: 'Los Angeles Times',
    geolocation: 'El Segundo, California, United States',
    name: 'latimes',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline .authors .author-name a' },
      date: { selector: 'article .byline time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/story/"]',
        ].join(','),
      },
    },
    timezone: 'UTC-7',
  },
  lifewire: {
    baseUrl: 'https://www.lifewire.com',
    displayName: 'Lifewire',
    geolocation: 'New York City, New York, United States',
    name: 'lifewire',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '.article-meta a' },
      date: { selector: '.mntl-attribution__item-date' },
      spider:{
        attribute: 'href',
        selector: [
          '.news-latest__article a',
          '.mntl-carousel__wrapper li a',
        ].join(','),
      },
    },
    timezone: 'EDT',
  },
  mashable: {
    baseUrl: 'https://www.mashable.com',
    displayName: 'Mashable',
    geolocation: 'New York City, New York, United States',
    name: 'mashable',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'header a[href*="/author/"]' },
      date: { selector: 'header time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/article/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  menshealth: {
    baseUrl: 'https://www.menshealth.com',
    displayName: 'Men\'s Health',
    geolocation: 'New York City, New York, United States',
    name: 'menshealth',
    selectors: {
      article: { selector: '.article-body-content p' },
      author: { selector: 'header address a[href*="/author/"]' },
      date: { selector: 'header time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/health/"]',
          'a[href*="/entertainment/"]',
          'a[href*="/fitness/"]',
          'a[href*="/grooming/"]',
          'a[href*="/style/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  morningstar: {
    baseUrl: 'https://www.morningstar.com',
    displayName: 'Morning Star',
    geolocation: 'Chicago, Illinois, United States',
    name: 'morningstar',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header a[href*="/authors/"]' },
      date: { selector: 'article header time' },
      spider:{
        attribute: 'href',
        selector: [
          'article a',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  nationalgeographic: {
    baseUrl: 'https://www.nationalgeographic.com',
    displayName: 'National Geographic',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'nationalgeographic',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header .Byline .Byline__Author a[href*="/author/"]' },
      date: { selector: 'article header .Byline__TimestampWrapper .Byline__Meta--publishDate' },
      spider:{
        attribute: 'href',
        selector: [
          'a[class*="AnchorLink"]',
          'a[href*="/magazine/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  nature: {
    baseUrl: 'https://www.nature.org',
    displayName: 'Nature',
    geolocation: 'London, England',
    name: 'nature',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="#author"]' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/articles/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  nbcnews: {
    baseUrl: 'https://www.nbcnews.com',
    displayName: 'NBC News',
    geolocation: 'New York City, New York, United States',
    name: 'nbcnews',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { attribute:'content', selector: 'time' },
      spider:{
        attribute: 'href',
        selector: [
          '*[class*="articleTitle"] a',
          'a[href*="/news/"]',
          'a[href*="/politics/"]',
          'a[href*="/pop-culture/"]',
          'a[href*="/us-news/"]',
          'a[href*="/world/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  newsweek: {
    baseUrl: 'https://www.newsweek.com',
    displayName: 'Newsweek',
    geolocation: 'New York City, New York, United States',
    name: 'newsweek',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { attribute:'content', selector: 'time' },
      spider:{
        attribute: 'href',
        selector: '.news-title a',
      },
    },
    timezone: TIMEZONES.default,
  },
  newyorker: {
    baseUrl: 'https://www.newyorker.com',
    displayName: 'The New Yorker',
    geolocation: 'New York City, New York, United States',
    name: 'newyorker',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article *[class*="BylinesWrapper"] a[href*="/contributors"]' },
      date: { attribute: 'datetime', selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/culture/"]',
          'a[href*="/magazine/"]',
          'a[href*="/news/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  npr: {
    baseUrl: 'https://www.npr.org',
    displayName: 'NPR',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'npr',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '#storybyline .byline__name a' },
      date: {
        attribute:'datetime',
        selector: 'article time', 
      },
      image: { selector: '#storytext picture img.img' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  nytimes: {
    baseUrl: 'https://www.nytimes.com',
    disabled: true,
    displayName: 'New York Times (Coming Soon)',
    geolocation: 'New York City, New York, United States',
    name: 'nytimes',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector: 'disabled' },
      spider:{ selector: 'disabled' },
    },
    timezone: TIMEZONES.default,
  },
  out: {
    baseUrl: 'https://www.out.com',
    displayName: 'Out',
    geolocation: 'Los Angeles, California, United States',
    name: 'out',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { attribute: 'content', selector: 'article .social-date,article .social-date-modified' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  people: {
    baseUrl: 'https://www.people.com',
    displayName: 'People',
    geolocation: 'New York City, New York, United States',
    name: 'people',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .mntl-bylines__item a[href*="/author/"]' },
      date: { selector: '.mntl-attribution__item-date' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/celebrity/"]',
          'a[href*="/entertainment/"]',
          'a[href*="/home/"]',
          'a[href*="/human-interest/"]',
          'a[href*="/fashion/"]',
          'a[href*="/food/"]',
          'a[href*="/lifestyle/"]',
          'a[href*="/news/"]',
          'a[href*="/politics/"]',
          'a[href*="/royals/"]',
          'a[href*="/style/"]',
          'a[href*="/tv/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  politico: {
    baseUrl: 'https://www.politico.com',
    displayName: 'Politico',
    geolocation: 'Arlington County, Virginia, United States',
    name: 'politico',
    selectors: {
      article: { selector: '.article__container .article__content' },
      author: { selector: '.article-meta .authors a, .story-meta__authors a' },
      date: { selector: '.article-meta .article-meta__datetime-duration .date-time__date, .story-meta__timestamp, time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/news/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  polygon: {
    baseUrl: 'https://www.polygon.com',
    displayName: 'Polygon',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'polygon',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/authors/"]' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[data-analytics-link*="article"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  popsci: {
    baseUrl: 'https://www.popsci.com',
    displayName: 'Popular Science ',
    geolocation: 'New York City, New York, United States',
    name: 'popsci',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .Article-author a' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/gear/"]',
          'a[href*="/health/"]',
          'a[href*="/science/"]',
          'a[href*="/technology/"]',
          '.article-container a',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  popularmechanics: {
    baseUrl: 'https://www.popularmechanics.com',
    displayName: 'Popular Mechanics ',
    geolocation: 'New York City, New York, United States',
    name: 'popularmechanics',
    selectors: {
      article: { selector: '.article-body-content' },
      author: { selector: 'address a[href*="/author/"]' },
      date: { selector: 'address time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/airplanes/"]',
          'a[href*="/adventure/"]',
          'a[href*="/cars/"]',
          'a[href*="/culture/"]',
          'a[href*="/home/"]',
          'a[href*="/military/"]',
          'a[href*="/science/"]',
          'a[href*="/space/"]',
          'a[href*="/technology/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  psychologytoday: {
    baseUrl: 'https://www.psychologytoday.com',
    displayName: 'Psychology Today',
    geolocation: 'New York City, New York, United States',
    name: 'psychologytoday',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/us/docs/"]' },
      date: { selector: 'article .blog_entry--date' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/us/blog/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  reuters: {
    baseUrl: 'https://www.reuters.com', 
    displayName: 'Reuters',
    geolocation: 'London, England, United Kingdom',
    name: 'reuters',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '*[class*="author-name"] a' },
      date: { selector: 'article header time span' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/business/"]',
          'a[href*="/breakingviews/"]',
          'a[href*="/investigations/"]',
          'a[href*="/lifestyle/"]',
          'a[href*="/sports/"]',
          'a[href*="/technology/"]',
          'a[href*="/legal/"]',
          'a[href*="/markets/"]',
          'a[href*="/world/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  rollingstone: {
    baseUrl: 'https://www.rollingstone.com',
    displayName: 'Rolling Stone',
    geolocation: 'New York City, New York, United States',
    name: 'rollingstone',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author-name a' },
      date: { selector: 'article .author time, main time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/music/"]',
          'a[href*="/politics/"]',
          'a[href*="/culture/"]',
          'a[href*="/tv-movies/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  science: {
    baseUrl: 'https://www.science.org',
    displayName: 'Science',
    geolocation: 'New York City, New York, United States',
    maxAge: '7d',
    name: 'science',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { selector: 'time' },
      image: { selector: 'section img' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  sciencedaily: {
    baseUrl: 'https://www.sciencedaily.com',
    displayName: 'Science Daily',
    geolocation: 'Rockville, Maryland, United States',
    maxAge: '4d',
    name: 'sciencedaily',
    selectors: {
      article: { selector: '#story_text p' },
      author: { selector: '#source' },
      date: { selector: '#date_posted' },
      spider: {
        attribute: 'href',
        selector: 'a[href*="/releases/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  scitechnewsnetwork: {
    baseUrl: 'https://www.scitechnewsnetwork.com',
    displayName: 'Sci-Tech News Network',
    fetchPolicy: { waitUntil: 'networkidle0' },
    geolocation: 'Washington, District of Columbia, United States',
    name: 'scitechnewsnetwork',
    selectors: {
      article: { selector: '.content, .article-content, body > .container' },
      date: { firstOnly: true, selector: '.content, .article-content, body > .container > .row' },
      spider: {
        attribute: 'href',
        selector: 'a[href*="/article/"]',
      },
    },
    sitemaps: [
      {
        spider: {
          dateSelector: { selector: '.date-published' },
          selector: '.article-item',
        },
        url: 'https://www.scitechnewsnetwork.com/latest-news/',
      },
    ],
    timezone: TIMEZONES.default,
  },
  space: {
    baseUrl: 'https://www.space.com',
    displayName: 'Space',
    geolocation: 'New York City, New York, United States',
    name: 'space',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author-byline__authors .author-byline__author-name a' },
      date: { selector: 'article time' },
      image: { selector: 'section picture img' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  stockhead: {
    baseUrl: 'https://stockhead.com.au',
    displayName: 'Stockhead ',
    geolocation: 'Western Australia, Australia',
    name: 'stockhead',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/author/"]' },
      date: { selector: 'article time.updated, article time.published' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/cryptocurrency/"]',
          'a[href*="/energy/"]',
          'a[href*="/experts/"]',
          'a[href*="/health/"]',
          'a[href*="/news/"]',
          'a[href*="/resources/"]',
          'a[href*="/tech/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  sundaytimes: {
    baseUrl: 'https://www.thetimes.co.uk',
    displayName: 'The Sunday Times ',
    geolocation: 'London, England, United Kingdom',
    name: 'thetimes',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/article/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.uk,
  },
  techcrunch: {
    baseUrl: 'https://www.techcrunch.com',
    displayName: 'TechCrunch ',
    geolocation: 'San Francisco, California, United States',
    name: 'techcrunch',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/author/"]' },
      date: { selector: 'article time, article .full-date-time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/${YYYY}/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  telegraph: {
    baseUrl: 'https://www.telegraph.co.uk',
    displayName: 'The Telegraph',
    geolocation: 'Victoria, London, United Kingdom',
    name: 'telegraph',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .e-byline__author' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'article a, a[class*="headline__link"]',
      },
    },
    timezone: TIMEZONES.uk,
  },
  theatlantic: {
    baseUrl: 'https://www.theatlantic.com',
    displayName: 'The Atlantic',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'theatlantic',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article header #byline a' },
      date: { selector: 'article header time' },
      spider: {
        attribute: 'href',
        selector: 'a[class*="titleLink"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  thedrive: {
    baseUrl: 'https://www.thedrive.com',
    displayName: 'The Drive',
    geolocation: 'New York City, New York, United States',
    name: 'thedrive',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'a[href*="/author/"]' },
      date: { selector: 'article time' },
      spider: {
        attribute: 'href',
        selector: [
          'a[href*="/news/"]',
          'a[href*="/car-reviews/"]',
          'a[href*="/cleaning-detailing/"]',
          'a[href*="/guides-and-gear/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  thefastmode: {
    baseUrl: 'https://www.thefastmode.com',
    displayName: 'The Fast Mode',
    geolocation: 'New York, New York, United States',
    name: 'thefastmode',
    selectors: {
      article: { selector: '.itemFullText p' },
      author: { selector: 'a[href*="/author/"]' },
      date: { attribute: 'title', selector: '.itemDateCreated' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/business/"]',
          'a[href*="/technology-solutions/"]',
          'a[href*="/leadership-and-management/"]',
          'a[href*="/investments-and-expansions/"]',
          'a[href*="/growth-and-profitability/"]',
          'a[href*="/mergers-and-acquisitions/"]',
          'a[href*="/mobile-network-operators-"]',
          'a[href*="/solution-vendors-/"]',
          'a[href*="/startups/"]',
          'a[href*="/regulations/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  theguardian: {
    baseUrl: 'https://www.theguardian.com',
    displayName: 'The Guardian',
    geolocation: 'London, United Kingdom',
    name: 'theguardian',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'address a[rel*="author"]' },
      date: { selector: 'details summary, article time' },
      spider:{
        attribute: 'href',
        selector: 'a[data-link-name="article"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  thehill: {
    baseUrl: 'https://www.thehill.com',
    displayName: 'The Hill',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'thehill',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .submitted-by a[href*="/author/"]' },
      date: { selector: 'article .submitted-by' },
      image: { selector: 'figure img[src*="i0.wp.com/thehill.com"]' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/homenews/"]',
          'a[href*="/newsletters/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  thestar: {
    baseUrl: 'https://www.thestar.com',
    displayName: 'Toronto Star',
    geolocation: 'Toronto, Ontario',
    name: 'thestar',
    selectors: {
      article: { selector: '.c-article-body p' },
      author: { selector: '.article__byline .article__author a' },
      date: { selector: '.article__byline .article__published-date' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/business/"]',
          'a[href*="/life/"]',
          'a[href*="/opinion/"]',
          'a[href*="/politics/"]',
          'a[href*="/sports/"]',
          'a[href*="/entertainment/"]',
          'a[href*="/news/"]',
          'a[href*="/world/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  thestreet: {
    baseUrl: 'https://www.thestreet.com',
    disabled: true,
    displayName: 'The Street',
    geolocation: 'New York City, New York, United States',
    name: 'thestreet',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href*="/author/"]' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'disabled',
        // selector: [
        //   'a[href*="/breaking-news/"]',
        //   'a[href*="/restaurants/"]',
        //   'a[href*="/investing/"]',
        //   'a[href*="/travel/"]',
        //   'a[href*="/technology/"]',
        //   'a[href*="/taxes/"]',
        // ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  theverge: {
    baseUrl: 'https://www.theverge.com',
    displayName: 'The Verge',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'theverge',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[class*="/authors/"]' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'li[class*="duet--content-cards"] a',
      },
    },
    timezone: TIMEZONES.default,
  },
  time: {
    baseUrl: 'https://www.time.com',
    displayName: 'Time',
    geolocation: 'New York City, New York, United States',
    name: 'time',
    selectors: {
      article: { selector: '#article-body p' },
      author: { selector: '.author a' },
      date: { selector: '.author .timestamp time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  usatoday: {
    baseUrl: 'https://www.usatoday.com',
    displayName: 'USA Today',
    geolocation: 'Tysons, Virginia, United States',
    name: 'usatoday',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article a[href="/staff/"]' },
      date: { attribute: 'aria-label', selector: 'article div[aria-label^="Published"]' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/story/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  usnews: {
    baseUrl: 'https://www.usnews.com',
    displayName: 'U.S. News',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'usnews',
    selectors: {
      article: { selector: '#main-column p' },
      author: { selector: '*[class*="BylineArticle__AuthorWrapper"] a' },
      date: { selector: '*[class*="BylineArticle__AuthorWrapper"] *[class*="BylineArticle__DateSpan"]' },
      image: { selector: 'section picture img' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/story/"]',
          'a[href*="/articles/"]',
          'a[href*="/news/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  variety: {
    baseUrl: 'https://www.variety.com',
    displayName: 'Variety',
    geolocation: 'Los Angeles, California, United States',
    name: 'variety',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'article a',
          'a[href*="/film/"]',
          'a[href*="/news/"]',
          'a[href*="/tv/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  venturebeat: {
    baseUrl: 'https://www.venturebeat.com',
    displayName: 'Venture Beat',
    geolocation: 'San Francisco, California, United States',
    name: 'venturebeat',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { selector: 'time' },
      image: { selector: 'header img' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: TIMEZONES.default,
  },
  vice: {
    baseUrl: 'https://www.vice.com',
    displayName: 'Vice',
    geolocation: 'Brooklyn, New York, United States',
    name: 'vice',
    selectors: {
      article: { selector: 'main p' },
      author: { selector: '.contributor a' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/article/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  vox: {
    baseUrl: 'https://www.vox.com',
    displayName: 'Vox',
    geolocation: 'Washington, Distric of Columbia, United States',
    name: 'vox',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .a[data-analytics-link="author-name"]' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/article/"]',
          'a[href*="/technology/"]',
          'a[data-analytics-link="article"]',
        ].join(','),
      },
    },
    timezone: 'EDT',
  },
  vulture: {
    baseUrl: 'https://www.vulture.com',
    displayName: 'Vulture',
    geolocation: 'New York, United States',
    name: 'vulture',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author-name a' },
      date: { selector: 'article time, .article-timestamp' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/article/"]',
          'a[href*="/${YYYY}/"]',
        ].join(','),
      },
    },
    timezone: TIMEZONES.default,
  },
  washingtonpost: {
    baseUrl: 'https://www.washingtonpost.com',
    disabled: true,
    displayName: 'The Washington Post (Coming Soon)',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'washingtonpost',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector:'disabled' },
      spider:{ selector: 'disabled' },
    },
    timezone: TIMEZONES.default,
  },
  wilsoncenter: {
    baseUrl: 'https://www.wilsoncenter.org',
    disabled: true,
    displayName: 'Wilson Center',
    geolocation: 'Washington, District of Columbia, United States',
    name: 'wilsoncenter',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector:'disabled' },
      spider:{ selector: 'disabled' },
    },
    timezone: TIMEZONES.default,
  },
  wired: {
    baseUrl: 'https://www.wired.com',
    displayName: 'Wired',
    geolocation: 'San Francisco, California, United States',
    name: 'wired',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .bylines .byline__name a' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/story/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
  wsj: {
    baseUrl: 'https://www.wsj.com',
    displayName: 'The Wall Street Journal',
    geolocation: 'New York City, New York, United States',
    name: 'wsj',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .article-byline a' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: 'article a, a[href*="/articles/"]',
      },
    },
    timezone: TIMEZONES.default,
  },
};
