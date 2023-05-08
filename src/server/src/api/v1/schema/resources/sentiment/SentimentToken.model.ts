import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { Token } from '../nlp/Token.model';

export abstract class SentimentToken<
    A extends SentimentTokenAttributes = SentimentTokenAttributes,
    B extends SentimentTokenCreationAttributes = SentimentTokenCreationAttributes,
  > extends Token<A, B> implements SentimentTokenAttributes {
  
}