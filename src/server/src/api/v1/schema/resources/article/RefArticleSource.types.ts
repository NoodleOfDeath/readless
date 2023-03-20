import { DatedAttributes } from '../../types';

export type RefArticleSourceAttributes = DatedAttributes & {
  articleId: number;
  sourceId: number;
};

export type RefArticleSourceCreationAttributes = {
  articleId: number;
  sourceId: number;
};