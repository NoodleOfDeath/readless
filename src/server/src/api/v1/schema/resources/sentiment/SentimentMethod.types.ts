import { DatedAttributes } from '../../types';

export type SentimentMethodAttributes = DatedAttributes & {
  name: string;
  displayName: string;
  description?: string;
};

export type SentimentMethodCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  displayName: string;
  description?: string;
};

export const PUBLIC_SENTIMENT_METHOD_ATTRIBUTES = ['name', 'displayName', 'description'];

export type PublicSentimentMethodAttributes = {
  name: string;
  displayName: string;
  description?: string;
};

export const SENTIMENT_METHOD_NAMES = ['afinn', 'openai', 'vader'] as const;

export type SentimentMethodName = typeof SENTIMENT_METHOD_NAMES[number];

export const SENTIMENT_METHODS: Record<string, SentimentMethodCreationAttributes> = {
  'afinn': {
    description: 'AFINN is a list of English words rated for valence with an integer between minus five (negative) and plus five (positive).',
    displayName: 'AFINN',
    name: 'afinn',
  },
  'openai': {
    description: 'OpenAI\'s sentiment analysis model is a single model that yields state-of-the-art results on a number of domains by learning from a large and diverse training set.',
    displayName: 'OpenAI',
    name: 'openai',
  },
  'vader': {
    description: 'VADER (Valence Aware Dictionary and sEntiment Reasoner) is a lexicon and rule-based sentiment analysis tool that is specifically attuned to sentiments expressed in social media.',
    displayName: 'VADER',
    name: 'vader',
  },
};