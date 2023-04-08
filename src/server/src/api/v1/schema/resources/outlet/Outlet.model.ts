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
  SiteMap,
} from './Outlet.types';
import { RateLimit } from '../../analytics/RateLimit.model';
import { BaseModel } from '../../base';

const WORKER_FETCH_RATE_LIMIT = process.env.WORKER_FETCH_RATE_LIMIT ? Number(process.env.WORKER_FETCH_RATE_LIMIT) : 1; // 1 for dev and testing
const WORKER_FETCH_INTERVAL_MS = process.env.WORKER_FETCH_INTERVAL_MS
  ? Number(process.env.WORKER_FETCH_INTERVAL_MS)
  : ms('1d');

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
    abcnews: {
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
    businessInsider: {
      displayName: 'Business Insider',
      name: 'business-insider',
      siteMaps: [{
        attribute: 'href',
        params: [[
          '',
          'lifestyle',
          'news',
          'guides',
          'guides/tech',
        ]],
        selector: 'a[class*="tout-title-link"]',
        url: 'https://www.businessinsider.com/${1}',
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
      },
      ],
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
    ft: {
      displayName: 'Financial Times',
      name: 'ft',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'business',
          'economics',
          'education',
          'energy',
          'environment',
          'fashion',
          'film',
          'food',
          'gaming',
          'markets',
          'technology',
          'us',
          'work-careers',
          'world',
        ]],
        selector: 'a[class*="js-teaser-heading-link"]',
        url: 'https://www.ft.com/${1}',
      }],
    },
    huffpost: {
      displayName: 'HuffPost',
      name: 'huffpost',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'entertainment',
          'entertainment/arts',
          'impact/business',
          'impact/green',
          'section/health',
          'news',
          'news/topic/coronavirus',
          'news/world-news',
        ]],
        selector: 'a[class*="card__headline"]',
        url: 'https://www.huffpost.com/${1}',
      }],
    },
    politoco: {
      displayName: 'Politico',
      name: 'politico',
      siteMaps: [{
        attribute: 'href',
        params: [[
          'congress',
          'news/elections',
          'section/magazine',
          'white-house',
        ]],
        selector: 'article header h3 a[href=*="https://www.politico.com/news"]',
        url: 'https://www.politico.com/${1}',
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
    wired: {
      displayName: 'Wired',
      name: 'wired',
      siteMaps: [{
        attribute: 'href',
        params: [[
          '',
          'category/backchannel',
          'category/business',
          'category/culture',
          'category/gear',
          'category/ideas',
          'category/science',
          'category/security',
        ]],
        selector: 'a[class*="SummaryItemHedLink"]',
        url: 'https://www.wired.com/${1}/',
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
        selector: 'h3 > a',
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
