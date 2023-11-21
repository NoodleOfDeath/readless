import { PollOptionAttributes } from './PollOption.types';
import { DatedAttributes } from '../../types';

export type PollAttributes = DatedAttributes & {
  name: string;
  title: string;
};

export type PollCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  title: string;
  options?: PollOptionAttributes[];
};

export const PUBLIC_POLL_ATTRIBUTES = [
  'id',
  'title',
] as const;

export type PublicPollAttributes = Pick<
  PollAttributes,
  typeof PUBLIC_POLL_ATTRIBUTES[number]>;