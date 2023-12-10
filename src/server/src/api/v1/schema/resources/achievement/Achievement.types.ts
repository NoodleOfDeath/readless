import { User } from '../../models';
import { DatedAttributes } from '../../types';

export type AchievementCriteriaMetric = 'count' | 'time';

export type AchievementTable = 'logs' | 'summary_interactions';

export type AchievementAttributes = DatedAttributes & {
  name: string;
  description?: string;
  displayName?: string;
  beforeDateBased?: Date;
  points?: number;
};

export type AchievementCreationAttributes = Partial<DatedAttributes> & {
  name: string;
  description?: string;
  displayName?: string;
  points?: number;
  beforeDateBased?: Date;
  findCandidates?: () => Promise<User[]>;
};

export const PUBLIC_ACHIEVEMENT_ATTRIBUTES = [
  'id',
  'name',
  'description',
  'displayName',
  'points',
  'createdAt',
] as const;

export type PublicAchievementAttributes = Pick<
  AchievementAttributes,
  typeof PUBLIC_ACHIEVEMENT_ATTRIBUTES[number]>;