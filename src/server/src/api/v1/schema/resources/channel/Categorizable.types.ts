import { DatedAttributes } from '../../types';

export type CategorizableAttributes = DatedAttributes & {
  parentId: number;
  category: string;
};

export type CategorizableCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  category: string;
};

export const PUBLIC_CATEGORIZABLE_ATTRIBUTES = ['parentId', 'category'] as const;

export type PublicCategorizableAttributes = Pick<CategorizableAttributes, typeof PUBLIC_CATEGORIZABLE_ATTRIBUTES[number]>;