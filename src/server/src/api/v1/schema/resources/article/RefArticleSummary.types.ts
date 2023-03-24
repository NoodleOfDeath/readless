import { DatedAttributes } from '../../types';

export type RefArticleSummaryAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

export type RefArticleSummaryCreationAttributes = {
  articleId: number;
  sourceId: number;
};