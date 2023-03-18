import { DatedAttributes } from '../../types';

export type RefArticleSourceAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

export type RefArticleSourceCreationAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};