import { DatedAttributes } from '../../types';

export type AchievementCriteria = {
  table?: string;
  column?: string;
};

export type AchievementAttributes = DatedAttributes & {
  name: string;
  criteria?: AchievementCriteria;
  description?: string;
  displayName?: string;
  points?: number;
};

export type AchievementCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  criteria?: AchievementCriteria;
  description?: string;
  displayName?: string;
  points?: number;
};