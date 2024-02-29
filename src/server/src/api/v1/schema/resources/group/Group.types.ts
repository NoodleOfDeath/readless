import { DatedAttributes } from '../../types';

export const GROUP_TYPES = ['topic'] as const;

export type GroupType = typeof GROUP_TYPES[number];

export type GroupAttributes = DatedAttributes & {
  /** type of this Group */
  type: GroupType;
};

export type GroupCreationAttributes = {
  type: GroupType;
};

