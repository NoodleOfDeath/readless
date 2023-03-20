import { DatedAttributes } from '../../types';

export type RefArticleMediaAttributes = DatedAttributes & {
  articleId: number;
  mediaId: number;
};

export type RefArticleMediaCreationAttributes = {
  articleId: number;
  mediaId: number;
};