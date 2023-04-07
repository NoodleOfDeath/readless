import { DatedAttributes } from '../../types';

export type CategoryAttributes = DatedAttributes & {
  /** type of this category */
  name: string;
  /** mdi icon for this string **/
  icon: string;
};

export type CategoryCreationAttributes = {
  name: string;
  icon: string;
};