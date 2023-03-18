import { DatedAttributes } from '../../types';

export type RefArticleInteractionAttributes = DatedAttributes & {
  articleId: number;
  interactionId: number;
};

export type RefArticleInteractionCreationAttributes = DatedAttributes & {
  articleId: number;
  interactionId: number;
};