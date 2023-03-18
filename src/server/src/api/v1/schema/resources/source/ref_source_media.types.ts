import { DatedAttributes } from '../../types';

export type RefSourceMediaAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};

export type RefSourceMediaCreationAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};