import ms from 'ms';
import {
  AfterFind,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  FetchPolicy,
  OUTLETS,
  OutletAttributes,
  OutletCreationAttributes,
  Selectors,
} from './Outlet.types';
import { BaseModel } from '../../base';
import { RateLimit } from '../../system/RateLimit.model';

const OUTLET_FETCH_LIMIT = process.env.OUTLET_FETCH_LIMIT ? Number(process.env.OUTLET_FETCH_LIMIT) : 1; // 1 for dev and testing
const OUTLET_MAX_ATTEMPT_LIMIT = process.env.OUTLET_MAX_ATTEMPT_LIMIT ? Number(process.env.OUTLET_MAX_ATTEMPT_LIMIT) : 5;
const OUTLET_FETCH_INTERVAL = process.env.OUTLET_FETCH_INTERVAL || '1d';

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

  static async initOutlets() {
    for (const outlet of Object.values(OUTLETS)) {
      await this.upsert(outlet);
    }
  } 

  @AfterFind
  static async legacySupport(cursor: Outlet | Outlet[]) {
    if (!cursor) {
      return;
    }
    const outlets = Array.isArray(cursor) ? cursor : [cursor];
    for (const outlet of outlets) {
      outlet.set('sentiment', 0, { raw: true });
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
