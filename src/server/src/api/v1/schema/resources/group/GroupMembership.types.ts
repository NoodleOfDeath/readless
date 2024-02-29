import { DatedAttributes } from '../../types';

export type GroupMembershipAttributes = DatedAttributes & {
  groupId: number;
  childId: number;
};

export type GroupMembershipCreationAttributes = Partial<DatedAttributes> & {
  groupId: number;
  childId: number;
};