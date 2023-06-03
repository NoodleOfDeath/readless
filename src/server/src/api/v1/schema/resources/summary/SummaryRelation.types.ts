import { DatedAttributes } from '../../types';

export type SummaryRelationAttributes = DatedAttributes & {
  parentId: number;
  siblingId: number;
  confidence: number;
};

export type SummaryRelationCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  siblingId: number;
  confidence: number;
};