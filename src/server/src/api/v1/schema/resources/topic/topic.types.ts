import { DatedAttributes } from '../../types';

export type TopicAttributes = DatedAttributes & {
  name: string;
  description: string;
};

export type TopicCreationAttributes = DatedAttributes & {
  name: string;
  description: string;
};