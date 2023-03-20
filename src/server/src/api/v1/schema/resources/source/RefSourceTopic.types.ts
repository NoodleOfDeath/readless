import { DatedAttributes } from '../../types';

export type RefSourceTopicAttributes = DatedAttributes & {
  sourceId: number;
  topicId: number;
};

export type RefSourceTopicCreationAttributes = {
  sourceId: number;
  topicId: number;
};