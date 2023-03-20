import { DatedAttributes } from '../../types';

export type RefOutletMediaAttributes = DatedAttributes & {
  outletId: number;
  mediaId: number;
};

export type RefOutletMediaCreationAttributes = {
  outletId: number;
  mediaId: number;
};
