import { DatedAttributes } from '../../types';

export const TOKEN_TYPES = [
  'activity',
  'adjective',
  'business',
  'city',
  'controversy',
  'country',
  'event',
  'geopolitical-interaction',
  'group',
  'innovation',
  'person',
  'place',
  'organization',
  'other',
  'social-interaction',
  'sports-team',
  'us-state',
] as const;

export type TokenType = typeof TOKEN_TYPES[number];

export type TokenAttributes = DatedAttributes & {
  parentId: number;
  text: string;
  type: TokenType;
};

export type TokenCreationAttributes = {
  parentId: number;
  text: string;
  type?: TokenType;
};

export const PUBLIC_TOKEN_ATTRIBUTES = ['id', 'text', 'type'] as const;

export type PublicTokenAttributes = {
  text: string;
  type: TokenType;
};