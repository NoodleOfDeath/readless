import {
  Column,
  DataType,
  Index,
} from 'sequelize-typescript';

import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { BaseModel } from '../../base';

export abstract class SentimentToken<
    A extends SentimentTokenAttributes = SentimentTokenAttributes,
    B extends SentimentTokenCreationAttributes = SentimentTokenCreationAttributes,
  > extends BaseModel<A, B> implements SentimentTokenAttributes {
    
  @Index({
    name: 'sentiment_token_parent_id_text_unique',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Index({
    name: 'sentiment_token_parent_id_text_unique',
    unique: true,
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare text: string;
  
}