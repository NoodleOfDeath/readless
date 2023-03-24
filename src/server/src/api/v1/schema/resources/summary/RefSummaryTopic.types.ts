import { DatedAttributes } from '../../types';

export type RefSummaryTopicAttributes = DatedAttributes & {
  sourceId: number;
  topicId: number;
};

export type RefSummaryTopicCreationAttributes = {
  sourceId: number;
  topicId: number;
};