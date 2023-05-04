import { 
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SentimentAttributes, SentimentCreationAttributes } from './Sentiment.types';
import { BaseModel } from '../../base';

export abstract class Sentiment<
    A extends SentimentAttributes = SentimentAttributes,
    B extends SentimentCreationAttributes = SentimentCreationAttributes,
  > extends BaseModel<A, B> implements SentimentAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    unique: true,
  })
  declare parentId: number;

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