import { DatedAttributes } from '../../types';

export type RefTopicMediaAttributes = DatedAttributes & {
  topicId: number;
  mediaId: number;
};

export type RefTopicMediaCreationAttributes = {
  topicId: number;
  mediaId: number;
};