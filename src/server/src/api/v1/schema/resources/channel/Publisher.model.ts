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
import { PUBLIC_PUBLISHERS } from './queries';
import { SupportedLocale } from '../../../../../core/locales';
import { BaseModel } from '../../base';
import { Job } from '../../models';
import { RateLimit } from '../../system/RateLimit.model';
import { PrepareOptions } from '../../types';

const PUBLISHER_FETCH_LIMIT = process.env.PUBLISHER_FETCH_LIMIT ? Number(process.env.PUBLISHER_FETCH_LIMIT) : 1; // 1 for dev and testing
const PUBLISHER_MAX_ATTEMPT_LIMIT = process.env.PUBLISHER_MAX_ATTEMPT_LIMIT ? Number(process.env.PUBLISHER_MAX_ATTEMPT_LIMIT) : 5;
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
    const publishers: PublisherAttributes[] = await this.store.query(PUBLIC_PUBLISHERS, {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
    });
    return {
      count: publishers?.length ?? 0,
      rows: publishers ?? [],
    };
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

  async reset() {
    this.set('failureCount', 0);
    this.set('delayedUntil', null);
    await this.save();
  }

  async success() {
    await this.reset();
    this.set('lastFetchedAt', new Date());
    await this.save();
  }

  async fail() {
    this.set('failureCount', this.failureCount + 1);
    await this.save();
  }
  
  async delay() {
    const date = new Date(Date.now() + ms(process.env.BACKOFF_INTERVAL || '1h') * this.failureCount);
    this.set('delayedUntil', date);
    const jobs = await Job.findAll({
      where: {
        group: this.name,
        queue: 'sitemaps',
      },
    });
    console.log(`Delaying ${jobs.length} for publisher ${this.name}`);
    for (const job of jobs) {
      const newDate = new Date(ms(process.env.BACKOFF_INTERVAL || '1h') * Math.max(this.failureCount, job.attempts));
      await job.schedule(newDate);
    }
    await this.save();
  }

  async failAndDelay() {
    await this.fail();
    await this.delay();
  }

  async setRateLimit(
    namespace = 'default', 
    limit = namespace === 'default' ? PUBLISHER_FETCH_LIMIT : PUBLISHER_MAX_ATTEMPT_LIMIT, 
    window = PUBLISHER_FETCH_INTERVAL
  ) {
    const key = ['//publisher', this.id, this.name, namespace].join('§§');
    const [rateLimit] = await RateLimit.upsert({
      expiresAt: new Date(Date.now() + ms(window)),
      key,
      limit,
      window: ms(window),
    });
    return rateLimit;
  }

  async getRateLimit(
    namespace = 'default',
    limit = namespace === 'default' ? PUBLISHER_FETCH_LIMIT : PUBLISHER_MAX_ATTEMPT_LIMIT, 
    window = PUBLISHER_FETCH_INTERVAL
  ) {
    const key = ['//publisher', this.id, this.name, namespace].join('§§');
    let rateLimit = await RateLimit.findOne({ where: { key } });
    if (!rateLimit) {
      rateLimit = await this.setRateLimit(namespace, limit, window);
    }
    return rateLimit;
  }

}
