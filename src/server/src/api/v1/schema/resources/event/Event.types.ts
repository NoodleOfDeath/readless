import { DurationString } from '../../../../../utils';
import { DatedAttributes } from '../../types';

export type EventType = 
  'contest' | 'poll' | 'quiz' | 'survey';

export type EventAttributes = DatedAttributes & {
  name: string;
  type: EventType;
  title?: string;
  description?: string;
  startDate?: Date;
  duration?: DurationString;
};

export type EventCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  type: EventType;
  title?: string;
  description?: string;
  startDate?: Date;
  duration?: DurationString;
};

export const PUBLIC_EVENT_ATTRIBUTES = [
  'id',
  'name',
  'type',
  'title',
  'description',
  'startDate',
  'duration',
] as const;

export type PublicEventAttributes = Pick<
  EventAttributes,
  typeof PUBLIC_EVENT_ATTRIBUTES[number]>;