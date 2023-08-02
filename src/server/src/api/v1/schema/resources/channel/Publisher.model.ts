import ms from 'ms';
import {
  AfterFind,
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
import { BaseModel } from '../../base';
import { RateLimit } from '../../system/RateLimit.model';

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

  public static async prepare() {
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
      console.log('translating', publisher.name);
      await PublisherTranslation.translate(publisher, ['description']);
    }
  }

  @AfterFind
  static async legacySupport(cursor: Publisher | Publisher[]) {
    if (!cursor) {
      return;
    }
    const publishers = Array.isArray(cursor) ? cursor : [cursor];
    for (const publisher of publishers) {
      publisher.set('sentiment', 0, { raw: true });
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
  declare imageUrl?: string;
  
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
