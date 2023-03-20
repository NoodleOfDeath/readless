import { DatedAttributes } from '../../types';

export type RefArticleInteractionAttributes = DatedAttributes & {
  articleId: number;
  interactionId: number;
};

export type RefArticleInteractionCreationAttributes = {
  articleId: number;
  interactionId: number;
};