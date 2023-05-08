import { Table } from 'sequelize-typescript';

import {
  SummarySentimentAttributes,
  SummarySentimentCreationAttributes,
} from './SummarySentiment.types';
import {
  SummarySentimentTokenAttributes,
  SummarySentimentTokenCreationAttributes,
} from './SummarySentimentToken.types';
import { Sentiment } from '../sentiment/Sentiment.model';

@Table({
  modelName: 'summary_sentiment',
  paranoid: true,
  timestamps: true,
})
export class SummarySentiment<
  A extends SummarySentimentAttributes = SummarySentimentAttributes, 
  B extends SummarySentimentCreationAttributes = SummarySentimentCreationAttributes>
  extends Sentiment<
    SummarySentimentTokenAttributes, 
    SummarySentimentTokenCreationAttributes, A, B> 
  implements SummarySentimentAttributes {

}