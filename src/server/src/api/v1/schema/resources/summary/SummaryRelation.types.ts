import { DatedAttributes } from '../../types';

export type SummaryRelationAttributes = DatedAttributes & {
  parentId: number;
  siblingId: number;
};

export type SummaryRelationCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  siblingId: number;
};