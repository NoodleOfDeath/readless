import { DatedAttributes } from '../../types';

export type RefSourceMediaAttributes = DatedAttributes & {
  sourceId: number;
  mediaId: number;
};

export type RefSourceMediaCreationAttributes = {
  sourceId: number;
  mediaId: number;
};