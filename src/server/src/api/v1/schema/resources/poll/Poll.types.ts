import { DatedAttributes } from '../../types';
import { PollOptionAttributes } from './PollOption.types';

export type PollAttributes = DatedAttributes & {
  name: string;
  title: string;
  options?: PollOptionAttributes[];
};

export type PollCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  title: string;
  options?: PollOptionAttributes[];
};

export const PUBLIC_POLL_ATTRIBUTES = [
  'id',
  'title',
  'options',
] as const;

export type PublicPollAttributes = Pick<
  PollAttributes,
  typeof PUBLIC_POLL_ATTRIBUTES[number]>;