import { Column, DataType } from 'sequelize-typescript';

import { SentimentAttributes, SentimentCreationAttributes } from './Sentiment.types';
import { SentimentMethodName } from './SentimentMethod.types';
import { BaseModel } from '../../base';

export abstract class Sentiment<
    A extends SentimentAttributes = SentimentAttributes,
    B extends SentimentCreationAttributes = SentimentCreationAttributes,
  > extends BaseModel<A, B> implements SentimentAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare parentId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare method: SentimentMethodName;
    
  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  declare score: number;

  @Column({ type: DataType.TEXT })
  declare payload?: string;
  
}