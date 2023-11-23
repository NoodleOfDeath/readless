import { DatedAttributes } from '../../types';

export type AchievementAttributes = DatedAttributes & {
  name: string;
  description?: string;
  displayName?: string;
  points?: number;
};

export type AchievementCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  description?: string;
  displayName?: string;
  points?: number;
};