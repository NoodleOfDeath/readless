import { DatedAttributes } from '../../types';

export const TOKEN_TYPES = [
  'business',
  'event',
  'group',
  'innovation',
  'person',
  'place',
  'organization',
  'other',
  'sports-team',
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