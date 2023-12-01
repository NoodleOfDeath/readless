import { DatedAttributes, PublicAchievementAttributes } from '../../types';

export type UserAchievementAttributes = DatedAttributes & {
  userId: number;
  achievementId: number;
  progress: number;
  achievedAt?: Date;
  achievement: PublicAchievementAttributes;
};

export type UserAchievementCreationAttributes = Partial<DatedAttributes> & {
  userId: number;
  achievementId: number;
  progress?: number;
  achievedAt?: Date;
};