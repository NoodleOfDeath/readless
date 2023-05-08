import {
  Column,
  DataType,
  Index,
} from 'sequelize-typescript';

import { SentimentAttributes, SentimentCreationAttributes } from './Sentiment.types';
import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { BaseModel } from '../../base';

export abstract class Sentiment<
    T extends SentimentTokenAttributes = SentimentTokenAttributes,
    C extends SentimentTokenCreationAttributes = SentimentTokenCreationAttributes,
    A extends SentimentAttributes<T> = SentimentAttributes<T>,
    B extends SentimentCreationAttributes<C> = SentimentCreationAttributes<C>,
  > extends BaseModel<A, B> implements SentimentAttributes<T> {
    
  @Index({
    name: 'sentiment_parent_id_method_unique',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Index({
    name: 'sentiment_parent_id_method_unique',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare method: string;
    
  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  declare score: number;
  
  declare tokens: T[];
  
}