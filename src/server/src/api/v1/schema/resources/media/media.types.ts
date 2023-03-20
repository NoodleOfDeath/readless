import { DatedAttributes } from '../../types';

export type MediaAttributes = DatedAttributes & {
  /** name of this media */
  type: string;
  /** base url of this media */
  url: string;
};

export type MediaCreationAttributes = {
  type: string;
  url: string;
};