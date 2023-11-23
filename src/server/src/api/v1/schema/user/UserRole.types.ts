import { DatedAttributes } from '../types';

export type UserRoleAttributes = DatedAttributes & {
  userId: number;
  roleId: number;
};

export type UserRoleCreationAttributes = {
  userId: number;
  roleId: number;
};