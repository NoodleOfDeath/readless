import ms from 'ms';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  FetchPolicy,
  OutletAttributes,
  OutletCreationAttributes,
  Selectors,
} from './Outlet.types';
import { BaseModel } from '../../base';
import { RateLimit } from '../../system/RateLimit.model';

const OUTLET_FETCH_LIMIT = process.env.OUTLET_FETCH_LIMIT ? Number(process.env.OUTLET_FETCH_LIMIT) : 1; // 1 for dev and testing
const OUTLET_MAX_ATTEMPT_LIMIT = process.env.OUTLET_MAX_ATTEMPT_LIMIT ? Number(process.env.OUTLET_MAX_ATTEMPT_LIMIT) : 5;
const OUTLET_FETCH_INTERVAL = process.env.OUTLET_FETCH_INTERVAL || '1d';

const DEFAULT_TIMEZONE = process.env.DEFAULT_TIMZONE || 'EST';

@Table({
  modelName: 'outlet',
  paranoid: true,
  timestamps: true,
})
export class Outlet<
    A extends OutletAttributes = OutletAttributes,
    B extends OutletCreationAttributes = OutletCreationAttributes,
  >
  extends BaseModel<A, B>
  implements OutletAttributes {

  static OUTLETS: Record<string, OutletCreationAttributes> = {
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
    abc: {
      baseUrl: 'https://abcnews.go.com',
      displayName: 'ABC News',
      name: 'abc',
      selectors: {
        article: { selector: 'article p' },
        author: { selector: '.ShareByline a[href*="/author/"]' },
        date: { selector: '.ShareByline > div  > div :last-child' },
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
      name: 'ars-technica',
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
    atlantic: {
      baseUrl: 'https://www.theatlantic.com',
      displayName: 'The Atlantic',
      name: 'atlantic',
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
        author: { selector: 'article *[class*="TextContributorName"]' },
        date: { selector: 'article time' },
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
      name: 'bleeping-computer',
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
        date: { selector: 'article time' },
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
      name: 'business-insider',
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
        date: { selector: 'article .contributors :last-child' },
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
      name: 'daily-mail',
      selectors: {
        article: { selector: 'article p' },
        author: { selector: 'article .author, .author' },
        date: { selector: 'article .date time' },
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
    defenseone: {
      baseUrl: 'https://www.defenseone.com',
      displayName: 'Defense One',
      name: 'defense-one',
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
    fbiotech: {
      baseUrl: 'https://www.fiercebiotech.com',
      displayName: 'Fierce Biotech',
      name: 'fbiotech',
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
      name: 'foreign-policy',
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
          selector: `a[href*="/${new Date().getFullYear()}/"]`,
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
        date: { selector: 'article .flex.text-sm' },
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
    guardian: {
      baseUrl: 'https://www.theguardian.com',
      displayName: 'The Guardian',
      name: 'theguardian',
      selectors: {
        article: { selector: 'article p' },
        author: { selector: 'address a[rel*="author/"]' },
        date: { selector: 'details summary' },
        spider:{
          attribute: 'href',
          selector: 'a[data-link-name="article"]',
        },
      },
      timezone: DEFAULT_TIMEZONE,
    },
    hill: {
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
        date: { selector: 'aritcle .byline time' },
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
      name: 'mens-health',
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
    natgeo: {
      baseUrl: 'https://www.nationalgeographic.com',
      displayName: 'National Geographic',
      name: 'national-geographic',
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
      displayName: 'New York Times (Coming Soon)',
      name: 'nytimes',
      selectors: {
        article: { selector: 'disabled' },
        author: { selector: 'disabled' },
        date: { selector: 'disabled' },
        spider:{ selector: 'disbaled' },
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
    popmechs: {
      baseUrl: 'https://www.popularmechanics.com',
      displayName: 'Popular Mechanics ',
      name: 'popular-mechanics',
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
    rstone: {
      baseUrl: 'https://www.rollingstone.com',
      displayName: 'Rolling Stone',
      name: 'rolling-stone',
      selectors: {
        article: { selector: 'article p' },
        author: { selector: 'article .author-name a' },
        date: { selector: 'article .author time' },
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
      name: 'science-daily',
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
    street: {
      baseUrl: 'https://www.thestreet.com',
      displayName: 'The Street',
      name: 'thestreet',
      selectors: {
        article: { selector: 'article p' },
        author: { selector: 'article .m-detail-header--meta-author' },
        date: { selector: 'article .m-detail-header--date' },
        spider:{
          attribute: 'href',
          selector: [
            'a[href*="/breaking-news/"]',
            'a[href*="/restaurants/"]',
            'a[href*="/investing/"]',
            'a[href*="/travel/"]',
            'a[href*="/technology/"]',
            'a[href*="/taxes/"]',
          ].join(','),
        },
      },
      timezone: DEFAULT_TIMEZONE,
    },
    sundaytimes: {
      baseUrl: 'https://www.thetimes.co.uk',
      displayName: 'The Sunday Times ',
      name: 'sunday-times',
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
    torontostar: {
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
    vbeat: {
      baseUrl: 'https://www.venturebeat.com',
      displayName: 'Venture Beat',
      name: 'venture-beat',
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
    verge: {
      baseUrl: 'https://www.theverge.com',
      displayName: 'The Verge',
      name: 'verge',
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
    wapo: {
      baseUrl: 'https://www.washingtonpost.com',
      displayName: 'The Washington Post (Coming Soon)',
      name: 'washington-post',
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
      displayName: 'Wilson Center',
      name: 'wilson-center',
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

  static async initOutlets() {
    for (const outlet of Object.values(this.OUTLETS)) {
      await this.upsert(outlet);
    }
  }

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare displayName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
  declare baseUrl: string;
  
  @Column({ type: DataType.STRING(2083) })
  declare brandImageUrl?: string;
  
  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({
    allowNull: false,
    defaultValue: {},
    type: DataType.JSON,
  })
  declare selectors: Selectors;
  
  @Column({ 
    defaultValue: '12h',
    type: DataType.STRING,
  })
  declare maxAge: string;
  
  @Column({ type: DataType.JSON })
  declare fetchPolicy?: Record<string, FetchPolicy>;
  
  @Column({ 
    defaultValue: 'UTC',
    type: DataType.STRING,
  })
  declare timezone: string;

  declare sentiment: number;

  async getRateLimit(namespace = 'default') {
    const key = ['//outlet', this.id, this.name, namespace].join('§§');
    let limit = await RateLimit.findOne({ where: { key } });
    if (!limit) {
      limit = await RateLimit.create({
        expiresAt: new Date(Date.now() + ms(OUTLET_FETCH_INTERVAL)),
        key,
        limit: namespace === 'default' ? OUTLET_FETCH_LIMIT : OUTLET_MAX_ATTEMPT_LIMIT,
        window: ms(OUTLET_FETCH_INTERVAL),
      });
    }
    return limit;
  }

}
