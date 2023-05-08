import { DatedAttributes } from '../../types';
import { Sentimental } from '../sentiment/Sentiment.types';

export type CategoryAttributes = DatedAttributes & Sentimental & {
  /** type of this category */
  name: string;
  /** display name of this category */
  displayName: string;
  /** mdi icon for this string **/
  icon: string;
};

export type CategoryCreationAttributes = Partial<DatedAttributes & Sentimental> & {
  name: string;
  displayName: string;
  icon: string;
};

export const PUBLIC_CATEGORY_ATTRIBUTES = ['id', 'name', 'displayName', 'icon'] as const;

export type PublicCategoryAttributes = Sentimental & {
  name: string;
  displayName: string;
  icon: string;
};