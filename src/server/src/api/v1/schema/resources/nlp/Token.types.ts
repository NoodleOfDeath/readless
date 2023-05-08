import { DatedAttributes } from '../../types';

export type TokenAttributes = DatedAttributes & {
  parentId: number;
  text: string;
};

export type TokenCreationAttributes = {
  parentId: number;
  text: string;
};