import { DatedAttributes } from '../types';

export type RoleAttributes = DatedAttributes & {
  name: string;
  priority: number;
  lifetime: string;
  refreshable: boolean;
  scope: string[];
};

export type RoleCreationAttributes = {
  name: string;
  priority: number;
  lifetime: string;
  refreshable: boolean;
  scope: string[];
};