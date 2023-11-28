import { DatedAttributes } from '../../types';

export type UserAchievementAttributes = DatedAttributes & {
  userId: number;
  achievementId: number;
  progress: number;
  achievedAt?: Date;
};

export type UserAchievementCreationAttributes = Partial<DatedAttributes> & {
  userId: number;
  achievementId: number;
  progress?: number;
  achievedAt?: Date;
};