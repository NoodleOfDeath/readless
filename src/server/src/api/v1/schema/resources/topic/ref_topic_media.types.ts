import { DatedAttributes } from '../../types';

export type RefTopicMediaAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};

export type RefTopicMediaCreationAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};