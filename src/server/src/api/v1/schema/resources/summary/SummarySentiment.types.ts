import {
  SummarySentimentTokenAttributes,
  SummarySentimentTokenCreationAttributes,
} from './SummarySentimentToken.types';
import { SentimentAttributes, SentimentCreationAttributes } from '../sentiment/Sentiment.types';

export type SummarySentimentAttributes = SentimentAttributes<SummarySentimentTokenAttributes>;
export type SummarySentimentCreationAttributes = SentimentCreationAttributes<SummarySentimentTokenCreationAttributes>;