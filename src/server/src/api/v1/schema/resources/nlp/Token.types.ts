import { DatedAttributes } from '../../types';

export const TOKEN_TYPES = [
  'activity',
  'adjective',
  'business',
  'controversy',
  'country',
  'event',
  'geopolitical-interaction',
  'group',
  'innovation',
  'person',
  'place',
  'other',
  'social-interaction',
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