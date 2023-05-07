import { DatedAttributes } from '../../types';

export type CategoryAttributes = DatedAttributes & {
  /** type of this category */
  name: string;
  /** display name of this category */
  displayName: string;
  /** mdi icon for this string **/
  icon: string;
  averageSentiment: number;
};

export type CategoryCreationAttributes = {
  name: string;
  displayName: string;
  icon: string;
};

export const PUBLIC_CATEGORY_ATTRIBUTES = ['id', 'name', 'displayName', 'icon'] as const;

export type PublicCategoryAttributes = {
  name: string;
  displayName: string;
  icon: string;
  averageSentiment: number;
};