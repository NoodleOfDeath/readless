import { TokenTypeName } from './TokenType.types';
import { DatedAttributes } from '../../types';

export type TokenAttributes = DatedAttributes & {
  parentId: number;
  text: string;
  type?: TokenTypeName;
};

export type TokenCreationAttributes = {
  parentId: number;
  text: string;
  type?: TokenTypeName;
};

export const PUBLIC_TOKEN_ATTRIBUTES = ['id', 'text', 'type'] as const;

export type PublicTokenAttributes = {
  text: string;
  type: TokenTypeName;
};