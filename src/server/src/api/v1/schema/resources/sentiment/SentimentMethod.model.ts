import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import {
  SENTIMENT_METHODS,
  SentimentMethodAttributes,
  SentimentMethodCreationAttributes,
} from './SentimentMethod.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'sentiment_method',
  paranoid: true,
  timestamps: true,
})
export class SentimentMethod<
    A extends SentimentMethodAttributes = SentimentMethodAttributes,
    B extends SentimentMethodCreationAttributes = SentimentMethodCreationAttributes,
  > extends BaseModel<A, B> implements SentimentMethodAttributes {

  public static async prepare() {
    for (const method of Object.values(SENTIMENT_METHODS)) {
      await this.upsert(method);
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
  
}