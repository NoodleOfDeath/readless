
import { DatedAttributes } from '../types';

export type MembershipAttributes = DatedAttributes & {
  userId: number;
  renewsOn: Date;
  tier: number;
  platform: string;
  platformUUID: string;
};

export type MembershipCreationAttributes = {
  userId: number;
  renewsOn: Date;
  tier: number;
  platform: string;
  platformUUID: string;
};