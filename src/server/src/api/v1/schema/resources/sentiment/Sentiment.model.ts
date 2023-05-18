import { Column, DataType } from 'sequelize-typescript';

import { SentimentAttributes, SentimentCreationAttributes } from './Sentiment.types';
import { SentimentMethodName } from './SentimentMethod.types';
import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { BaseModel } from '../../base';

export abstract class Sentiment<
    T extends SentimentTokenAttributes = SentimentTokenAttributes,
    C extends SentimentTokenCreationAttributes = SentimentTokenCreationAttributes,
    A extends SentimentAttributes<T> = SentimentAttributes<T>,
    B extends SentimentCreationAttributes<C> = SentimentCreationAttributes<C>,
  > extends BaseModel<A, B> implements SentimentAttributes<T> {
    
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
  
  declare tokens: T[];
  
}