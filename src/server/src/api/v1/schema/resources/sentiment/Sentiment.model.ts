import {
  Column,
  DataType,
  Index,
} from 'sequelize-typescript';

import { SentimentAttributes, SentimentCreationAttributes } from './Sentiment.types';
import { BaseModel } from '../../base';

export abstract class Sentiment<
    A extends SentimentAttributes = SentimentAttributes,
    B extends SentimentCreationAttributes = SentimentCreationAttributes,
  > extends BaseModel<A, B> implements SentimentAttributes {
    
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

}