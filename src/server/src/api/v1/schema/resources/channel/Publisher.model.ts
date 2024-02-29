import ms from 'ms';
import { QueryTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { OpenAIService } from './../../../../../services/';
import {
  FetchPolicy,
  PUBLISHERS,
  PublisherAttributes,
  PublisherCreationAttributes,
  Selectors,
  Sitemap,
} from './Publisher.types';
import { PublisherTranslation } from './PublisherTranslation.model';
import { QueryFactory } from '../../';
import { SupportedLocale } from '../../../../../core/locales';
import { BaseModel } from '../../base';
import { RateLimit } from '../../system/RateLimit.model';
import { PrepareOptions } from '../../types';

const PUBLISHER_FETCH_LIMIT = process.env.PUBLISHER_FETCH_LIMIT ? Number(process.env.PUBLISHER_FETCH_LIMIT) : 1; // 1 for dev and testing
const PUBLISHER_MAX_ATTEMPT_LIMIT = process.env.PUBLISHER_MAX_ATTEMPT_LIMIT ? Number(process.env.PUBLISHER_MAX_ATTEMPT_LIMIT) : 999;
const PUBLISHER_FETCH_INTERVAL = process.env.PUBLISHER_FETCH_INTERVAL || '1d';

@Table({
  modelName: 'publisher',
  paranoid: true,
  timestamps: true,
})
export class Publisher<
    A extends PublisherAttributes = PublisherAttributes,
    B extends PublisherCreationAttributes = PublisherCreationAttributes,
  >
  extends BaseModel<A, B>
  implements PublisherAttributes {

  public static async prepare({ translate }: PrepareOptions = {}) {
    const newPublishers: Publisher[] = [];
    for (const publisher of Object.values(PUBLISHERS)) {
      const old = await this.findOne({ where: publisher });
      if (!old) {
        const [newPublisher] = await this.upsert(publisher);
        newPublishers.push(newPublisher);
      }
    }
    const publishers = await this.findAll();
    const chatService = new OpenAIService();
    for (const publisher of publishers) {
      if (!publisher.description) {
        console.log('creating description for', publisher.name);
        try {
          publisher.set('description', await chatService.send(`Write a 2 sentence description of the publisher "${publisher.displayName}"`));
          chatService.clearConversation();
          await publisher.save();
        } catch (error) {
          console.log(error);
        }
      }
      if (translate) {
        console.log('translating', publisher.name);
        await PublisherTranslation.translate(publisher, ['description']);
      }
    }
  }

  static async getPublishers(locale: SupportedLocale = 'en') {
    const replacements = { locale };
    const publishers: PublisherAttributes[] = await this.sql.query(QueryFactory.getQuery('get_publishers'), {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
    });
    return {
      count: publishers?.length ?? 0,
      rows: publishers ?? [],
    };
  }
  
  async reset() {
    this.set('failureCount', 0);
    this.set('delayedUntil', null);
    await this.save();
  }

  async success() {
    if (this.failureCount) {
      this.set('fetchPolicy', {
        ...this.fetchPolicy,
        fetchRate: this.failureCount * ms('10m'),
      });
      await this.save();
    }
    await this.reset();
    this.set('lastStatusCode', 200);
    this.set('lastFetchedAt', new Date());
    await this.save();
  }

  async fail(statusCode = 403) {
    this.set('failureCount', (this.failureCount ?? 0) + 1);
    this.set('lastStatusCode', statusCode);
    await this.save();
  }
  
  async delay() {
    const date = new Date(Date.now() + ms(process.env.BACKOFF_INTERVAL || '10m') * (this.failureCount ?? 0));
    this.set('delayedUntil', date);
    await this.save();
  }

  async failAndDelay(statusCode = 403) {
    await this.fail(statusCode);
    await this.delay();
  }

  async setRateLimit(
    namespace = 'default', 
    window: number | string = PUBLISHER_FETCH_INTERVAL,
    limit = namespace === 'default' ? PUBLISHER_FETCH_LIMIT : PUBLISHER_MAX_ATTEMPT_LIMIT
  ) {
    const key = ['//publisher', this.id, this.name, namespace].join('§§');
    window = typeof window === 'number' ? window : ms(window);
    const [rateLimit] = await RateLimit.upsert({
      expiresAt: new Date(Date.now() + window),
      key,
      limit,
      window,
    });
    return rateLimit;
  }

  async getRateLimit(
    namespace = 'default',
    window: number | string = PUBLISHER_FETCH_INTERVAL,
    limit = namespace === 'default' ? PUBLISHER_FETCH_LIMIT : PUBLISHER_MAX_ATTEMPT_LIMIT
  ) {
    const key = ['//publisher', this.id, this.name, namespace].join('§§');
    let rateLimit = await RateLimit.findOne({ where: { key } });
    window = typeof window === 'number' ? window : ms(window);
    if (!rateLimit) {
      rateLimit = await this.setRateLimit(namespace, window, limit);
    }
    return rateLimit;
  }

  async getTranslations(locale: SupportedLocale = 'en') {
    return PublisherTranslation.findAll({
      where: {
        id: this.id,
        locale,
      },
    });
  }

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;  
  
  @Column({ 
    defaultValue: [],
    type: DataType.ARRAY(DataType.JSONB),
  })
  declare sitemaps: Sitemap[];

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
  declare imageUrl?: string;
  
  @Column({ type: DataType.TEXT })
  declare description?: string;

  @Column({
    allowNull: false,
    defaultValue: {},
    type: DataType.JSON,
  })
  declare selectors: Selectors;
  
  @Column({ type: DataType.STRING })
  declare geolocation?: string;
  
  @Column({ type: DataType.STRING })
  declare radius?: string;
  
  @Column({ 
    defaultValue: '12h',
    type: DataType.STRING,
  })
  declare maxAge: string;
  
  @Column({ type: DataType.JSON })
  declare fetchPolicy?: FetchPolicy;

  @Column({ type: DataType.DATE })
  declare lastFetchedAt?: Date;
  
  @Column({ type: DataType.INTEGER })
  declare lastStatusCode?: number;
  
  @Column({ type: DataType.TEXT })
  declare lastFetchResponse?: string;

  @Column({
    defaultValue: 0, 
    type: DataType.INTEGER, 
  })
  declare failureCount?: number;
  
  @Column({ type: DataType.DATE })
  declare delayedUntil?: Date;

  @Column({ 
    defaultValue: 'UTC',
    type: DataType.STRING,
  })
  declare timezone: string;
  
  @Column({ type: DataType.BOOLEAN })
  declare disabled?: boolean;

  declare sentiment?: number;

  icon?: string;

}
