import { DatedAttributes } from '../../types';

export type RecapSummaryAttributes = DatedAttributes & {
  parentId: number;
  summaryId: number;
};

export type RecapSummaryCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  summaryId: number;
};