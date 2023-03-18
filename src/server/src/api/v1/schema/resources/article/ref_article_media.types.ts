import { DatedAttributes } from '../../types';

export type RefArticleMediaAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};

export type RefArticleMediaCreationAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};