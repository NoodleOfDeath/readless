import { DatedAttributes } from '../../types';

export type RefSourceOutletAttributes = DatedAttributes & {
  sourceId: number;
  outletId: number;
};

export type RefSourceOutletCreationAttributes = {
  sourceId: number;
  outletId: number;
};