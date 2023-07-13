import ms from 'ms';
import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  FetchPolicy,
  PUBLISHERS,
  PublisherAttributes,
  PublisherCreationAttributes,
  Selectors,
} from './Publisher.types';
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

  static async prepare() {
    for (const publisher of Object.values(PUBLISHERS)) {
      await this.upsert(publisher);
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