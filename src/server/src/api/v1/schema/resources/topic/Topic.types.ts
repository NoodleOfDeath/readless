import { DatedAttributes } from '../../types';

export type TopicAttributes = DatedAttributes & {
  name: string;
  description: string;
};

export type TopicCreationAttributes = {
  name: string;
  description: string;
};