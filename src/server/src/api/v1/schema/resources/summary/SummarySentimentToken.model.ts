import { Table } from 'sequelize-typescript';

import {
  SummarySentimentTokenAttributes,
  SummarySentimentTokenCreationAttributes,
} from './SummarySentimentToken.types';
import { SentimentToken } from '../sentiment/SentimentToken.model';

@Table({
  modelName: 'summary_sentiment_token',
  paranoid: true,
  timestamps: true,
})
export class SummarySentimentToken<A extends SummarySentimentTokenAttributes = SummarySentimentTokenAttributes, B extends SummarySentimentTokenCreationAttributes = SummarySentimentTokenCreationAttributes> extends SentimentToken<A, B> implements SummarySentimentTokenAttributes {

}