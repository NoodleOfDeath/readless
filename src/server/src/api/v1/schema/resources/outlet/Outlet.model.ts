import ms from 'ms';
import {
  Column,
  DataType,
  Scopes,
  Table,
} from 'sequelize-typescript';

import {
  FetchPolicy,
  OutletAttributes,
  OutletCreationAttributes,
  PUBLIC_OUTLET_ATTRIBUTES,
  SiteMap,
} from './Outlet.types';
import { RateLimit } from '../../analytics/RateLimit.model';
import { BaseModel } from '../../base';

const WORKER_FETCH_RATE_LIMIT = process.env.WORKER_FETCH_RATE_LIMIT ? Number(process.env.WORKER_FETCH_RATE_LIMIT) : 1; // 1 for dev and testing
const WORKER_FETCH_INTERVAL_MS = process.env.WORKER_FETCH_INTERVAL_MS
  ? Number(process.env.WORKER_FETCH_INTERVAL_MS)
  : ms('1d');

@Scopes(() => ({ public: { attributes: [...PUBLIC_OUTLET_ATTRIBUTES] } }))
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
    abc: {
      displayName: 'ABC News',
      name: 'abc',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'Business',
          'Entertainment',
          'Health',
          'Politics',
          'Lifestyle',
          'Sports',
          'Technology',
        ]],
        selector: 'h2 a[class*="AnchorLink"]',
        url: 'https://abcnews.go.com/${1}',
      }],
    },
    advocate: {
      displayName: 'Advocate',
      name: 'advocate',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.advocate.com',
      }],
    },
    aei: {
      displayName: 'AEI',
      name: 'aei',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="hero__post"] a',
        url: 'https://www.aei.org',
      }],
    },
    apnews: {
      displayName: 'AP News',
      name: 'apnews',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="Component-headline"]',
        url: 'https://www.apnews.com',
      }],
    },
    'ars-technica': {
      displayName: 'ars technica',
      name: 'ars-technica',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.arstechnica.com',
      }],
    },
    atlantic: {
      displayName: 'The Atlantic',
      name: 'atlantic',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.theatlantic.com',
      }],
    },
    barrons: {
      displayName: 'Barron\'s',
      name: 'barrons',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="headline-link"]',
        url: 'https://www.barrons.com/real-time',
      }],
    },
    bbc: {
      displayName: 'BBC',
      name: 'bbc',
      siteMaps: [{
        attribute: 'href',
        params: [[
          '',
          'culture',
          'culture/music',
          'future',
          'news',
          'reel',
          'sport',
          'travel',
          'worklife',
        ]],
        selector: 'a[class*="media__link"],a[class*="link__overlay__link"],a[class*="item__title"]',
        url: 'https://www.bbc.com/${1}',
      }],
    },
    billboard: {
      displayName: 'billboard',
      name: 'billboard',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="c-title"]',
        url: 'https://www.billboard.com',
      }],
    },
    'bleeping-computer': {
      displayName: 'Bleeping Computer',
      name: 'bleeping-computer',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="bc_latest_news_text"] a',
        url: 'https://www.bleepingcomputer.com',
      }],
    },
    bloomberg: {
      displayName: 'Bloomberg',
      name: 'bloomberg',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.bloomberg.com',
      }],
    },
    'business-insider': {
      displayName: 'Business Insider',
      name: 'business-insider',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="tout-title-link"]',
        url: 'https://www.businessinsider.com',
      }],
    },
    bustle: {
      displayName: 'Bustle',
      name: 'bustle',
      siteMaps: [{ 
        attribute:'href', 
        'params': [[
          'books',
          'entertainment',
          'fashion',
          'info',
          'news',
          'politics',
          'rule-breakers',
          'wellness',
        ]], 
        selector: 'ul[class="Lwl"] li a', 
        url: 'https://www.bustle.com/archive/${MMMM}/${YYYY}/${1}', 
      }],
    },
    buzzfeed: {
      displayName: 'BuzzFeed',
      name: 'buzzfeed',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="feedItem"] a',
        url: 'https://www.buzzfeed.com',
      }],
    },
    cbsnews: {
      displayName: 'CBS News',
      name: 'cbsnews',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.cbsnews.com',
      }],
    },
    cnbc: {
      displayName: 'CNBC',
      name: 'cnbc',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class="SiteMapArticleList-link"]',
        url: 'https://www.cnbc.com/site-map/articles/${YYYY}/${MMMM}/${D}/',
      }],
    },
    cnn: {
      displayName: 'CNN',
      name: 'cnn',
      siteMaps: [{
        selector: 'loc', 
        url: 'https://www.cnn.com/sitemaps/cnn/news.xml', 
      }],
    },
    coindesk: {
      displayName: 'CoinDesk',
      name: 'coindesk',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="most-read-article"] a',
        url: 'https://www.coindesk.com',
      }],
    },
    cryptoglobe: {
      displayName: 'Cryptoglobe',
      name: 'cryptoglobe',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="u-link"]',
        url: 'https://www.cryptoglobe.com',
      }],
    },
    csis: {
      displayName: 'CSIS',
      name: 'csis',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'american-innovation',
          'climate-change',
          'cybersecurity',
          'defense-and-security',
          'economics',
          'energy-and-sustainability',
          'food-and-security',
          'geopolitics',
          'global-health',
          'human-rights',
          'missile-defense',
          'nuclear-issues',
          'space',
          'technology',
          'trade',
        ]],
        selector: 'article[typeof*="schema:Article"] a',
        url: 'https://www.csis.org/topics/${1}',
      }],
    },
    'defense-one': {
      displayName: 'Defense One',
      name: 'defense-one',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="river-item-hed"],a[class*="skybox-link"]',
        url: 'https://www.defenseone.com',
      }],
    },
    'developer-tech': {
      displayName: 'Developer Tech',
      name: 'developer-tech',
      siteMaps: [{
        attribute: 'href',
        selector: 'header[class*="article-header"] a',
        url: 'https://www.developer-tech.com',
      }],
    },
    economist: {
      displayName: 'The Economist (Coming Soon)',
      name: 'economist',
      siteMaps: [],
    },
    enews: {
      displayName: 'E! News',
      name: 'enews',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="widget__title"]',
        url: 'https://www.eonline.com',
      }],
    },
    espn: {
      displayName: 'ESPN',
      name: 'espn',
      siteMaps: [{
        attribute: 'href',
        selector: 'ul[class*="headlineStack"] li a',
        url: 'https://www.espn.com',
      }],
    },
    essence: {
      displayName: 'Essence',
      name: 'essence',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.essence.com',
      }],
    },
    ew: {
      displayName: 'Entertainment Weekly',
      name: 'ew',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="entityTout"] a',
        url: 'https://www.ew.com',
      }],
    },
    forbes: {
      displayName: 'Forbes',
      name: 'forbes',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="headlink"]',
        url: 'https://www.forbes.com',
      }],
    },
    'foreign-policy': {
      displayName: 'Foreign Policy',
      name: 'foreign-policy',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="hed-heading"]',
        url: 'https://www.foreignpolicy.com',
      }],
    },
    fortune: {
      displayName: 'Fortune',
      name: 'fortune',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="titleLink"]',
        url: 'https://www.fortune.com',
      }],
    },
    foxnews: {
      displayName: 'Fox News',
      name: 'foxnews',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.foxnews.com',
      }],
    },
    ft: {
      displayName: 'Financial Times',
      name: 'ft',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="js-teaser-heading-link"]',
        url: 'https://www.ft.com',
      }],
    },
    gizmodo: {
      displayName: 'Gizmodo',
      name: 'gizmodo',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.gizmodo.com',
      }],
    },
    guardian: {
      displayName: 'The Guardian',
      name: 'theguardian',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="js-headline-text"]',
        url: 'https://www.theguardian.com',
      }],
    },
    hill: {
      displayName: 'The Hill',
      name: 'thehill',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="featured-cards"] a',
        url: 'https://www.thehill.com',
      }],
    },
    huffpost: {
      displayName: 'HuffPost',
      name: 'huffpost',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="card__headline"]',
        url: 'https://www.huffpost.com',
      }],
    },
    inverse: {
      displayName: 'Inverse',
      name: 'inverse',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[href*="/gaming"],a[href*="/science"],a[href*="/tech"],a[href*="entertainment"]',
        url: 'https://www.coindesk.com',
      }],
    },
    kotaku: {
      displayName: 'Kotaku',
      name: 'kotaku',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.kotaku.com',
      }],
    },
    ksl: {
      displayName: 'KSL',
      name: 'ksl',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="headling"] a',
        url: 'https://www.ksl.com',
      }],
    },
    latimes: {
      displayName: 'Los Angelos Times',
      name: 'latimes',
      siteMaps: [{
        attribute: 'href',
        selector: 'h1[class*="promo-title"] a,h2[class*="promo-title"] a',
        url: 'https://www.latimes.com',
      }],
    },
    lifewire: {
      displayName: 'Lifewire',
      name: 'lifewire',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="news-latest__article"] a',
        url: 'https://www.lifewire.com',
      }],
    },
    mashable: {
      displayName: 'Mashable',
      name: 'mashable',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[href*="/article"]',
        url: 'https://www.mashable.com',
      }],
    },
    'mens-health': {
      displayName: 'Men\'s Health',
      name: 'mens-health',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[href*="/fitness"],a[href*="/health"],a[href*="/style"],a[href*="/grooming"]',
        url: 'https://www.menshealth.com',
      }],
    },
    'national-geographic': {
      displayName: 'National Geographic',
      name: 'national-geographic',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="AnchorLink"]',
        url: 'https://www.nationalgeographic.com',
      }],
    },
    nbcnews: {
      displayName: 'NBC News',
      name: 'nbcnews',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="tease-card"] a',
        url: 'https://www.nbcnews.com',
      }],
    },
    newsweek: {
      displayName: 'Newsweek',
      name: 'newsweek',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="news-title"] a',
        url: 'https://www.newsweek.com',
      }],
    },
    newyorker: {
      displayName: 'The New Yorker',
      name: 'newyorker',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="SummaryItem"]',
        url: 'https://www.newyorker.com',
      }],
    },
    npr: {
      displayName: 'NPR',
      name: 'npr',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.npr.org',
      }],
    },
    nytimes: {
      displayName: 'New York Times (Coming Soon)',
      name: 'nytimes',
      siteMaps: [],
    },
    out: {
      displayName: 'Out',
      name: 'out',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.out.com',
      }],
    },
    people: {
      displayName: 'People',
      name: 'people',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="entityTout"] a',
        url: 'https://www.people.com',
      }],
    },
    politico: {
      displayName: 'Politico',
      name: 'politico',
      siteMaps: [{
        attribute: 'href',
        selector: 'h3[class*="headline"] a',
        url: 'https://www.politico.com',
      }],
    },
    'popular-mechanics': {
      displayName: 'Popular Mechanics ',
      name: 'popular-mechanics',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[href*="/technology"],a[href*="/science"],a[href*="/space"]',
        url: 'https://www.popularmechanics.com',
      }],
    },
    reuters: {
      displayName: 'Reuters',
      name: 'reuters',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'business', 
          'entertainment',
          'health',
          'legal',
          'markets',
          'technology',
          'world',
        ]],
        selector: 'a[class*="text__heading_"]',
        url: 'https://www.reuters.com/${1}',
      }],
    },
    'rolling-stone': {
      displayName: 'Rolling Stone',
      name: 'rolling-stone',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="c-title"]',
        url: 'https://www.rollingstone.com',
      }],
    },
    science: {
      displayName: 'Science',
      name: 'science',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.science.org',
      }],
    },
    'science-daily': {
      displayName: 'Science Daily',
      name: 'science-daily',
      siteMaps: [{
        attribute: 'href',
        selector: 'h3[class*="latest-head"] a',
        url: 'https://www.sciencedaily.com',
      }],
    },
    space: {
      displayName: 'Space',
      name: 'space',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="article-link"]',
        url: 'https://www.space.com',
      }],
    },
    'sunday-times': {
      displayName: 'The Sunday Times ',
      name: 'sunday-times',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="Item-content"] a',
        url: 'https://www.thetimes.co.uk',
      }],
    },
    telegraph: {
      displayName: 'The Telegraph',
      name: 'telegraph',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.telegraph.co.uk',
      }],
    },
    thestreet: {
      displayName: 'The Street',
      name: 'thestreet',
      siteMaps: [{
        attribute: 'href',
        selector: 'phoenix-card[role*="article"] a',
        url: 'https://www.thestreet.com',
      }],
    },
    time: {
      displayName: 'Time',
      name: 'time',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.time.com',
      }],
    },
    usatoday: {
      displayName: 'USA Today',
      name: 'usatoday',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[href*="/story"]',
        url: 'https://www.usatoday.com',
      }],
    },
    usnews: {
      displayName: 'U.S. News',
      name: 'usnews',
      siteMaps: [{
        attribute: 'href',
        selector: 'h3[class*="story-headline"] a',
        url: 'https://www.usnews.com',
      }],
    },
    'venture-beat': {
      displayName: 'Venture Beat',
      name: 'venture-beat',
      siteMaps: [{
        attribute: 'href',
        selector: 'article a',
        url: 'https://www.venturebeat.com',
      }],
    },
    vice: {
      displayName: 'Vice',
      name: 'vice',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="vice-card-hed__link"]',
        url: 'https://www.vice.com',
      }],
    },
    vox: {
      displayName: 'Vox',
      name: 'vox',
      siteMaps: [{
        attribute: 'href',
        selector: 'div[class*="c-newspaper"] a',
        url: 'https://www.vox.com',
      }],
    },
    'washington-post': {
      displayName: 'The Washington Post (Coming Soon)',
      name: 'washington-post',
      siteMaps: [],
    },
    'wilson-center': {
      displayName: 'Wilson Center',
      name: 'wilson-center',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="teaser"],a[class*="home-hero-event"]',
        url: 'https://www.wilsoncenter.org',
      }],
    },
    wired: {
      displayName: 'Wired',
      name: 'wired',
      siteMaps: [{
        attribute: 'href',
        selector: 'a[class*="SummaryItem"]',
        url: 'https://www.wired.com',
      }],
    },
    wsj: {
      displayName: 'The Wall Street Journal',
      name: 'wsj',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'arts',
          'book-arts',
          'business',
          'economy',
          'latest-headlines',
          'life-work',
          'markets',
          'opinion',
          'politics',
          'realestate',
          'sports',
          'style',
          'technology',
          'world',
        ]],
        selector: 'article a',
        url: 'https://www.wsj.com/news/${1}',
      }],
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
  
  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({
    allowNull: false,
    type: DataType.ARRAY(DataType.JSON),
  })
  declare siteMaps: SiteMap[];
  
  @Column({ type: DataType.JSON })
  declare fetchPolicy: FetchPolicy;
  
  async getRateLimit() {
    const key = ['//outlet', this.id, this.name].join('§§');
    let limit = await RateLimit.findOne({ where: { key } });
    if (!limit) {
      limit = await RateLimit.create({
        expiresAt: new Date(Date.now() + WORKER_FETCH_INTERVAL_MS),
        key,
        limit: WORKER_FETCH_RATE_LIMIT,
        window: WORKER_FETCH_INTERVAL_MS,
      });
    }
    return limit;
  }

}
