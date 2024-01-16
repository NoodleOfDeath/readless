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

export const SENTIMENT_METHOD_NAMES = ['afinn', 'claude-2.1', 'gpt-3.5', 'openai', 'vader'] as const;

export type SentimentMethodName = typeof SENTIMENT_METHOD_NAMES[number];

export const SENTIMENT_METHODS: Record<SentimentMethodName, SentimentMethodCreationAttributes> = {
  'afinn': {
    description: 'AFINN is a list of English words rated for valence with an integer between minus five (negative) and plus five (positive).',
    displayName: 'AFINN',
    name: 'afinn',
  },
  'claude-2.1': {
    description: 'Anthropic\'s Claude 2.5 LLM',
    displayName: 'Anthropic Claude 2.1',
    name: 'claude-2.1',
  },
  'gpt-3.5': {
    description: 'OpenAI\'s ChatGPT 3.5 LLM',
    displayName: 'OpenAI ChatGPT 3.5',
    name: 'gpt-3.5',
  },
  'openai': {
    description: 'OpenAI\'s ChatGPT 3.5 LLM',
    displayName: 'OpenAI',
    name: 'openai',
  },
  'vader': {
    description: 'VADER (Valence Aware Dictionary and sEntiment Reasoner) is a lexicon and rule-based sentiment analysis tool that is specifically attuned to sentiments expressed in social media.',
    displayName: 'VADER',
    name: 'vader',
  },
};