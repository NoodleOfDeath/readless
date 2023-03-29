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
import { BaseModel } from '../../base';

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
    name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    displayName: string;

  @Column({
    allowNull: false,
    type: DataType.ARRAY(DataType.JSON),
  })
    siteMaps: SiteMap[];

  @Column({ type: DataType.JSON })
    fetchPolicy: FetchPolicy;

}
