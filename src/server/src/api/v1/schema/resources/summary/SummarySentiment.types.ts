import { SummarySentimentTokenAttributes } from './SummarySentimentToken.types';
import { SentimentAttributes, SentimentCreationAttributes } from '../sentiment/Sentiment.types';

export type SummarySentimentAttributes = SentimentAttributes & {
  summary_sentiment_tokens: SummarySentimentTokenAttributes[];
}; 
export type SummarySentimentCreationAttributes = SentimentCreationAttributes;