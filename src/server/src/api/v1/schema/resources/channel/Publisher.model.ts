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
} from './Publisher.types';
import { PublisherTranslation } from './PublisherTranslation.model';
import { PUBLIC_PUBLISHERS } from './queries';
import { SupportedLocale } from '../../../../../core/locales';
import { BaseModel } from '../../base';
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
  
  @Column({ type: DataType.ARRAY<DataType.STRING> })
  declare sitemaps?: string[];

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
  declare fetchPolicy?: Record<string, FetchPolicy>;
  
  @Column({ 
    defaultValue: 'UTC',
    type: DataType.STRING,
  })
  declare timezone: string;
  
  @Column({ type: DataType.BOOLEAN })
  declare disabled?: boolean;

  declare sentiment?: number;
  
  async getRateLimit(namespace = 'default') {
    const key = ['//publisher', this.id, this.name, namespace].join('§§');
    let limit = await RateLimit.findOne({ where: { key } });
    if (!limit) {
      limit = await RateLimit.create({
        expiresAt: new Date(Date.now() + ms(PUBLISHER_FETCH_INTERVAL)),
        key,
        limit: namespace === 'default' ? PUBLISHER_FETCH_LIMIT : PUBLISHER_MAX_ATTEMPT_LIMIT,
        window: ms(PUBLISHER_FETCH_INTERVAL),
      });
    }
    return limit;
  }

}
