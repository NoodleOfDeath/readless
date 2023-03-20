import { DatedAttributes } from '../types';

export type RefUserRoleAttributes = DatedAttributes & {
  userId: number;
  roleId: number;
};

export type RefUserRoleCreationAttributes = {
  userId: number;
  roleId: number;
};