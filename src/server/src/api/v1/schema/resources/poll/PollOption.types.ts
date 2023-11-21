import { DatedAttributes } from '../../types';

export type PollOptionAttributes = DatedAttributes & {
  pollId: number;
  name: string;
  value: string;
  displayName?: string;
};

export type PollOptionCreationAttributes = Partial<DatedAttributes> & {
  pollId: number;
  name: string;
  value: string;
  displayName?: string;
};

export const PUBLIC_POLL_OPTION_ATTRIBUTES = [
  'id',
  'name',
  'value',
  'displayName',
] as const;

export type PublicPollOptionAttributes = Pick<
  PollOptionAttributes,
  typeof PUBLIC_POLL_OPTION_ATTRIBUTES[number]>;