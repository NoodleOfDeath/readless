import { DatedAttributes } from '../../types';
import { Sentimental } from '../sentiment/Sentiment.types';

export type FetchPolicy = {
  limit: number;
  window: string;
};

export type Selector = {
  selector: string;
  exclude?: string[];
  attribute?: string;
};

export type Selectors = {
  article: Selector;
  author: Selector;
  date: Selector;
  spider: Selector;
  image?: Selector;
  title?: Selector;
};

export type PublisherAttributes = DatedAttributes & Sentimental & {
  baseUrl: string;
  /** name of this publisher */
  name: string;
  /** xml site maps for this publisher and selector for extracting urls */
  displayName: string;
  imageUrl?: string;
  description?: string;
  selectors: Selectors;
  maxAge: string;
  /** fetch policy for this publisher */
  fetchPolicy?: Record<string, FetchPolicy>;
  timezone: string;
  disabled?: boolean;
};

export type PublisherCreationAttributes = Partial<DatedAttributes & Sentimental> & {
  baseUrl: string;
  name: string;
  displayName: string;
  imageUrl?: string;
  description?: string;
  selectors: Selectors;
  maxAge?: string;
  fetchPolicy?: Record<string, FetchPolicy>;
  timezone?: string;
  disabled?: boolean;
};

const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMZONE || 'EST';

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
    name: '9to5google',
    selectors: {
      article: { selector: '#river p' },
      author: { selector: '#main .author-name' },
      date: { selector: '#main .post-meta' },
      spider: {
        attribute: 'href',
        selector: 'a[class*="article__title"], article a',
      },
    },
  },
  _9to5mac: {
    baseUrl: 'https://9to5mac.com',
    displayName: '9to5mac',
    name: '9to5mac',
    selectors: {
      article: { selector: '#river p' },
      author: { selector: '#main .author-name' },
      date: { selector: '#main .post-meta' },
      spider: {
        attribute: 'href',
        selector: 'a[class*="article__title"]',
      },
    },
  },
  abcnews: {
    baseUrl: 'https://abcnews.go.com',
    displayName: 'ABC News',
    name: 'abcnews',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '.ShareByline a[href*="/author/"]' },
      date: { selector: '.ShareByline > div  > div :last-child, div[data-testid*="prism-byline"]' },
      spider: {
        attribute: 'href',
        selector: 'a[class*="AnchorLink"]',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  advocate: {
    baseUrl: 'https://www.advocate.com',
    displayName: 'Advocate',
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
    timezone: DEFAULT_TIMEZONE,
  },
  aei: {
    baseUrl: 'https://www.aei.org',
    disabled: true,
    displayName: 'AEI',
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
    timezone: DEFAULT_TIMEZONE,
  },
  apnews: {
    baseUrl: 'https://apnews.com',
    displayName: 'AP News',
    name: 'apnews',
    selectors: {
      article: { selector: '.Content .Article p' },
      author: { selector: '.Content .CardHeadline *[class*="Component-bylines"]' },
      date: { attribute: 'data-source', selector: '.Content .CardHeadline .Timestamp' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/article/"]',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  arstechnica: {
    baseUrl: 'https://www.arstechnica.com',
    displayName: 'ars technica',
    name: 'arstechnica',
    selectors: {
      article:{ selector: 'article p' }, 
      author: { selector: 'article header section *[itemprop*="author creator"] a' },
      date: { selector: 'article header time,article header .date' },
      spider: {
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  axios: {
    baseUrl: 'https://www.axios.com',
    displayName: 'Axios',
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
    timezone: DEFAULT_TIMEZONE,
  },
  barrons: {
    baseUrl: 'https://www.barrons.com/real-time',
    displayName: 'Barron\'s',
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
    timezone: DEFAULT_TIMEZONE,
  },
  bbc: {
    baseUrl: 'https://www.bbc.com',
    displayName: 'BBC',
    name: 'bbc',
    selectors: { 
      article: { selector: 'article p' },
      author: { selector: 'article *[class*="TextContributorName"], .author-unit' },
      date: { selector: 'article time, .author-unit' },
      spider:{ attribute: 'href', selector: 'a[class*="media__link"]' }, 
    },
    timezone: 'UTC+1',
  },
  billboard: {
    baseUrl: 'https://www.billboard.com',
    displayName: 'billboard',
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
    timezone: DEFAULT_TIMEZONE,
  },
  bleepingcomputer: {
    baseUrl: 'https://www.bleepingcomputer.com',
    displayName: 'Bleeping Computer',
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
    timezone: DEFAULT_TIMEZONE,
  },
  bloomberg: {
    baseUrl: 'https://www.bloomberg.com',
    displayName: 'Bloomberg',
    name: 'bloomberg',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'address p[class*="author/"] a' },
      date: { selector: 'article time[itemprop="datePublished"], article time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/articles/"]',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  businessinsider: {
    baseUrl: 'https://www.businessinsider.com',
    displayName: 'Business Insider',
    name: 'businessinsider',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '.byline .byline-author-name' },
      date: { selector: '.byline .byline-timestamp' },
      spider:{
        attribute: 'href',
        selector: 'a.tout-title-link',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  bustle: {
    baseUrl: 'https://www.bustle.com',
    displayName: 'Bustle',
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
    timezone: DEFAULT_TIMEZONE,
  },
  buzzfeed: {
    baseUrl: 'https://www.buzzfeed.com',
    displayName: 'BuzzFeed',
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
    timezone: DEFAULT_TIMEZONE,
  },
  cbsnews: {
    baseUrl: 'https://www.cbsnews.com',
    displayName: 'CBS News',
    name: 'cbsnews',
    selectors: {
      article: { selector: 'article p' },
      author : { selector: '' },
      date: { selector: 'article time' },
      spider:{ attribute: 'href', selector: 'a[href*="/news/"]' },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  cnbc: {
    baseUrl: 'https://www.cnbc.com',
    displayName: 'CNBC',
    name: 'cnbc',
    selectors: {
      article: { selector: '.ArticleBody-articleBody p' },
      author: { selector: '.Author-authorName' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: [
          '.LatestNews-headlineWrapper a',
          '.RiverHeadline-headline a',
        ].join(','),
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  cnn: {
    baseUrl: 'https://www.cnn.com',
    displayName: 'CNN',
    name: 'cnn',
    selectors: {
      article: { selector: 'main.article__main p' },
      author: { selector: '.headline__sub-text .byline_name' },
      date: { selector: '.headline__sub-text .timestamp' },
      spider:{
        attribute: 'href',
        selector: 'a[data-link-type="article"]',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  coindesk: {
    baseUrl: 'https://www.coindesk.com',
    displayName: 'CoinDesk',
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
    timezone: DEFAULT_TIMEZONE,
  },
  cryptoglobe: {
    baseUrl: 'https://www.cryptoglobe.com',
    displayName: 'Cryptoglobe',
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
    timezone: DEFAULT_TIMEZONE,
  },
  csis: {
    baseUrl: 'https://www.csis.org',
    displayName: 'CSIS',
    name: 'csis',
    selectors: {
      article: { selector: 'div[role*="article"] .column p' },
      author: { selector: 'article .contributors a' },
      date: { selector: 'article .contributors :last-child, main .mb-md' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  cultofmac: {
    baseUrl: 'https://www.cultofmac.com',
    displayName: 'Cult of Mac',
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
    timezone: DEFAULT_TIMEZONE,
  },
  dailymail: {
    baseUrl: 'https://www.dailymail.co.uk/ushome/index.html',
    displayName: 'Daily Mail',
    name: 'dailymail',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author, .author' },
      date: { selector: 'article .date time, .article-timestamp time' },
      spider:{
        attribute: 'href',
        selector: [
          '.article .articletext a',
          'a[href*="/news/"]',
          'a[href*="/article"]',
        ].join(','),
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  daringfireball: {
    baseUrl: 'https://www.daringfireball.net',
    displayName: 'Daring Fireball',
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
    timezone: DEFAULT_TIMEZONE,
  },
  defenseone: {
    baseUrl: 'https://www.defenseone.com',
    displayName: 'Defense One',
    name: 'defenseone',
    selectors: {
      article: { selector: 'div[role*="article"] .column' },
      author: { selector: 'article .contributors a, a[href*="/voices/"]' },
      date: { selector: 'article .contributors :last-child, time' },
      spider:{
        attribute: 'href',
        selector: [
          'a.skybox-link',
          'a[class*="hed-link"]',
        ].join(','),
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  developertech: {
    baseUrl: 'https://www.developer-tech.com',
    displayName: 'Developer Tech',
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
    timezone: DEFAULT_TIMEZONE,
  },
  digitaltrends: {
    baseUrl: 'https://www.digitaltrends.com',
    displayName: 'digitaltrends',
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
    timezone: DEFAULT_TIMEZONE,
  },
  economist: {
    baseUrl: 'https://www.economist.com',
    disabled: true,
    displayName: 'The Economist (Coming Soon)',
    name: 'economist',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector: 'disabled' },
      spider : { selector: 'disabled' },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  enews: {
    baseUrl: 'https://www.eonline.com',
    displayName: 'E! News',
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
  espn: {
    baseUrl: 'https://www.espn.com',
    displayName: 'ESPN',
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
    timezone: DEFAULT_TIMEZONE,
  },
  essence: {
    baseUrl: 'https://www.essence.com',
    displayName: 'Essence',
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
    timezone: DEFAULT_TIMEZONE,
  },
  ew: {
    baseUrl: 'https://www.ew.com',
    displayName: 'Entertainment Weekly',
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
    timezone: DEFAULT_TIMEZONE,
  },
  fiercebiotech: {
    baseUrl: 'https://www.fiercebiotech.com',
    disabled: true,
    displayName: 'Fierce Biotech',
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
    timezone: DEFAULT_TIMEZONE,
  },
  forbes: {
    baseUrl: 'https://www.forbes.com',
    displayName: 'Forbes',
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
    timezone: DEFAULT_TIMEZONE,
  },
  fortune: {
    baseUrl: 'https://www.fortune.com',
    displayName: 'Fortune',
    name: 'fortune',
    selectors: {
      article: { selector: '#article-content p' },
      author: { selector: '#content a[href*="/author/"]' },
      date: { selector: '#content' },
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
    timezone: DEFAULT_TIMEZONE,
  },
  ft: {
    baseUrl: 'https://www.ft.com',
    disabled: true,
    displayName: 'Financial Times',
    name: 'ft',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector: 'disabled' },
      spider : { selector: 'disabled' },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  futurism: {
    baseUrl: 'https://www.futurism.com',
    displayName: 'Furturism',
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
    timezone: DEFAULT_TIMEZONE,
  },
  gizmodo: {
    baseUrl: 'https://www.gizmodo.com', 
    displayName: 'Gizmodo',
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
    timezone: DEFAULT_TIMEZONE,
  },
  huffpost: {
    baseUrl: 'https://www.huffpost.com',
    displayName: 'HuffPost',
    name: 'huffpost',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'main header .entry__wirepartner span' },
      date: { selector: 'main header time' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/entry/"]',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  ieeespectrum: {
    baseUrl: 'https://spectrum.ieee.org',
    displayName: 'IEEE Spectrum',
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
    timezone: DEFAULT_TIMEZONE,
  },
  inews: {
    baseUrl: 'https://inews.co.uk',
    displayName: 'inews',
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
    timezone: DEFAULT_TIMEZONE,
  },
  inverse: {
    baseUrl: 'https://www.inverse.com',
    displayName: 'Inverse',
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
    timezone: DEFAULT_TIMEZONE,
  },
  investors: {
    baseUrl: 'https://www.investors.com/tag/all-news-and-stock-ideas/',
    displayName: 'Investors\'s Business Daily',
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
    timezone: DEFAULT_TIMEZONE,
  },
  jalopnik: {
    baseUrl: 'https://jalopnik.com/sitemap/${YYYY}/${MMMM}',
    displayName: 'Jalopnik',
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
    timezone: DEFAULT_TIMEZONE,
  },
  kotaku: {
    baseUrl: 'https://www.kotaku.com',
    displayName: 'Kotaku',
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
    timezone: DEFAULT_TIMEZONE,
  },
  ksl: {
    baseUrl: 'https://www.ksl.com',
    displayName: 'KSL',
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
    timezone: DEFAULT_TIMEZONE,
  },
  latimes: {
    baseUrl: 'https://www.latimes.com',
    displayName: 'Los Angeles Times',
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
    timezone: DEFAULT_TIMEZONE,
  },
  menshealth: {
    baseUrl: 'https://www.menshealth.com',
    displayName: 'Men\'s Health',
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
    timezone: DEFAULT_TIMEZONE,
  },
  morningstar: {
    baseUrl: 'https://www.morningstar.com',
    displayName: 'Morning Star',
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
    timezone: DEFAULT_TIMEZONE,
  },
  nationalgeographic: {
    baseUrl: 'https://www.nationalgeographic.com',
    displayName: 'National Geographic',
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
    timezone: DEFAULT_TIMEZONE,
  },
  nature: {
    baseUrl: 'https://www.nature.org',
    displayName: 'Nature',
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
    timezone: DEFAULT_TIMEZONE,
  },
  nbcnews: {
    baseUrl: 'https://www.nbcnews.com',
    displayName: 'NBC News',
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
    timezone: DEFAULT_TIMEZONE,
  },
  newsweek: {
    baseUrl: 'https://www.newsweek.com',
    displayName: 'Newsweek',
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
    timezone: DEFAULT_TIMEZONE,
  },
  newyorker: {
    baseUrl: 'https://www.newyorker.com',
    displayName: 'The New Yorker',
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
    timezone: DEFAULT_TIMEZONE,
  },
  npr: {
    baseUrl: 'https://www.npr.org',
    displayName: 'NPR',
    name: 'npr',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: '#storybyline .byline__name a' },
      date: { attribute:'datetime', selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  nytimes: {
    baseUrl: 'https://www.nytimes.com',
    disabled: true,
    displayName: 'New York Times (Coming Soon)',
    name: 'nytimes',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector: 'disabled' },
      spider:{ selector: 'disabled' },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  out: {
    baseUrl: 'https://www.out.com',
    displayName: 'Out',
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
    timezone: DEFAULT_TIMEZONE,
  },
  people: {
    baseUrl: 'https://www.people.com',
    displayName: 'People',
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
    timezone: DEFAULT_TIMEZONE,
  },
  politico: {
    baseUrl: 'https://www.politico.com',
    displayName: 'Politico',
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
    timezone: DEFAULT_TIMEZONE,
  },
  polygon: {
    baseUrl: 'https://www.polygon.com',
    displayName: 'Polygon',
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
    timezone: DEFAULT_TIMEZONE,
  },
  popsci: {
    baseUrl: 'https://www.popsci.com',
    displayName: 'Popular Science ',
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
    timezone: DEFAULT_TIMEZONE,
  },
  popularmechanics: {
    baseUrl: 'https://www.popularmechanics.com',
    displayName: 'Popular Mechanics ',
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
    timezone: DEFAULT_TIMEZONE,
  },
  psychologytoday: {
    baseUrl: 'https://www.psychologytoday.com',
    displayName: 'Psychology Today',
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
    timezone: DEFAULT_TIMEZONE,
  },
  reuters: {
    baseUrl: 'https://www.reuters.com', 
    displayName: 'Reuters',
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
    timezone: DEFAULT_TIMEZONE,
  },
  rollingstone: {
    baseUrl: 'https://www.rollingstone.com',
    displayName: 'Rolling Stone',
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
    timezone: DEFAULT_TIMEZONE,
  },
  science: {
    baseUrl: 'https://www.science.org',
    displayName: 'Science',
    maxAge: '7d',
    name: 'science',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  sciencedaily: {
    baseUrl: 'https://www.sciencedaily.com',
    displayName: 'Science Daily',
    maxAge: '4d',
    name: 'sciencedaily',
    selectors: {
      article: { selector: '#story_text p' },
      author: { selector: '#source' },
      date: { selector: '#date_posted' },
      spider:{
        attribute: 'href',
        selector: 'a[href*="/releases/"]',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  space: {
    baseUrl: 'https://www.space.com',
    displayName: 'Space',
    name: 'space',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .author-byline__authors .author-byline__author-name a' },
      date: { selector: 'article time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  stockhead: {
    baseUrl: 'https://stockhead.com.au',
    displayName: 'Stockhead ',
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
    timezone: DEFAULT_TIMEZONE,
  },
  sundaytimes: {
    baseUrl: 'https://www.thetimes.co.uk',
    displayName: 'The Sunday Times ',
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
    timezone: 'UTC+1',
  },
  techcrunch: {
    baseUrl: 'https://www.techcrunch.com',
    displayName: 'TechCrunch ',
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
    timezone: DEFAULT_TIMEZONE,
  },
  telegraph: {
    baseUrl: 'https://www.telegraph.co.uk',
    displayName: 'The Telegraph',
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
    timezone: 'UTC+1',
  },
  theatlantic: {
    baseUrl: 'https://www.theatlantic.com',
    displayName: 'The Atlantic',
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
    timezone: DEFAULT_TIMEZONE,
  },
  thedrive: {
    baseUrl: 'https://www.thedrive.com',
    displayName: 'The Drive',
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
    timezone: DEFAULT_TIMEZONE,
  },
  thefastmode: {
    baseUrl: 'https://www.thefastmode.com',
    displayName: 'The Fast Mode',
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
    timezone: DEFAULT_TIMEZONE,
  },
  theguardian: {
    baseUrl: 'https://www.theguardian.com',
    displayName: 'The Guardian',
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
    timezone: DEFAULT_TIMEZONE,
  },
  thehill: {
    baseUrl: 'https://www.thehill.com',
    displayName: 'The Hill',
    name: 'thehill',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .submitted-by a[href*="/author/"]' },
      date: { selector: 'article .submitted-by' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/homenews/"]',
          'a[href*="/newsletters/"]',
        ].join(','),
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  theindependent: {
    baseUrl: 'https://www.theindependent.co.uk',
    displayName: 'The Independent',
    name: 'theindependent',
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
    timezone: DEFAULT_TIMEZONE,
  },
  thestar: {
    baseUrl: 'https://www.thestar.com',
    displayName: 'Toronto Star',
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
    timezone: DEFAULT_TIMEZONE,
  },
  thestreet: {
    baseUrl: 'https://www.thestreet.com',
    disabled: true,
    displayName: 'The Street',
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
    timezone: DEFAULT_TIMEZONE,
  },
  theverge: {
    baseUrl: 'https://www.theverge.com',
    displayName: 'The Verge',
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
    timezone: DEFAULT_TIMEZONE,
  },
  time: {
    baseUrl: 'https://www.time.com',
    displayName: 'Time',
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
    timezone: DEFAULT_TIMEZONE,
  },
  usatoday: {
    baseUrl: 'https://www.usatoday.com',
    displayName: 'USA Today',
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
    timezone: DEFAULT_TIMEZONE,
  },
  usnews: {
    baseUrl: 'https://www.usnews.com',
    displayName: 'U.S. News',
    name: 'usnews',
    selectors: {
      article: { selector: '#main-column p' },
      author: { selector: '*[class*="BylineArticle__AuthorWrapper"] a' },
      date: { selector: '*[class*="BylineArticle__AuthorWrapper"] *[class*="BylineArticle__DateSpan"]' },
      spider:{
        attribute: 'href',
        selector: [
          'a[href*="/story/"]',
          'a[href*="/articles/"]',
          'a[href*="/news/"]',
        ].join(','),
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  variety: {
    baseUrl: 'https://www.variety.com',
    displayName: 'Variety',
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
    timezone: DEFAULT_TIMEZONE,
  },
  venturebeat: {
    baseUrl: 'https://www.venturebeat.com',
    displayName: 'Venture Beat',
    name: 'venturebeat',
    selectors: {
      article: { selector: 'article p' },
      author: { selector: 'article .byline-name a' },
      date: { selector: 'time' },
      spider:{
        attribute: 'href',
        selector: 'article a',
      },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  vice: {
    baseUrl: 'https://www.vice.com',
    displayName: 'Vice',
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
    timezone: DEFAULT_TIMEZONE,
  },
  vox: {
    baseUrl: 'https://www.vox.com',
    displayName: 'Vox',
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
    timezone: DEFAULT_TIMEZONE,
  },
  washingtonpost: {
    baseUrl: 'https://www.washingtonpost.com',
    disabled: true,
    displayName: 'The Washington Post (Coming Soon)',
    name: 'washingtonpost',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector:'disabled' },
      spider:{ selector: 'disabled' },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  wilsoncenter: {
    baseUrl: 'https://www.wilsoncenter.org',
    disabled: true,
    displayName: 'Wilson Center',
    name: 'wilsoncenter',
    selectors: {
      article: { selector: 'disabled' },
      author: { selector: 'disabled' },
      date: { selector:'disabled' },
      spider:{ selector: 'disabled' },
    },
    timezone: DEFAULT_TIMEZONE,
  },
  wired: {
    baseUrl: 'https://www.wired.com',
    displayName: 'Wired',
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
    timezone: DEFAULT_TIMEZONE,
  },
  wsj: {
    baseUrl: 'https://www.wsj.com',
    displayName: 'The Wall Street Journal',
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
    timezone: DEFAULT_TIMEZONE,
  },
};