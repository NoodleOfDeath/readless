import { DatedAttributes } from '../../types';

export type RefArticleTopicAttributes = DatedAttributes & {
  articleId: number;
  topicId: number;
};

export type RefArticleTopicCreationAttributes = DatedAttributes & {
  articleId: number;
  topicId: number;
};