import { ThirdParty } from './Alias.types';
import { DurationString } from '../../../../utils';
import { DatedAttributes, UserAchievementAttributes } from '../types';

export type UserEvent<T> = T & { 
  user?: string; 
  userId?: number;
  count?: number;
  rank?: number; 
  createdAt?: Date;
  updatedAt?: Date;
};

export type Streak = UserEvent<{
  start: Date;
  end: Date;
  length: number;
  expiresSoon?: boolean;
}>;

export type InteractionCount = UserEvent<{
  count: number;
}>;

export type UserStats = {
  memberSince?: Date;
  lastSeen?: Date;
  streak?: Streak;
  longestStreak?: Streak;
  interactionCounts?: {
    read: InteractionCount;
    share: InteractionCount;
  }
  achievements: UserAchievementAttributes[];
  updatedAt: Date;
};

export type Profile = {
  email?: string;
  emails?: string[];
  pendingEmails?: string[];
  username?: string;
  linkedThirdPartyAccounts?: ThirdParty[];
  preferences?: { [key: string]: unknown };
  stats?: UserStats;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CalculateStreakOptions = {
  limit?: number | 'ALL';
  longest?: boolean;
  userId?: number;
  expiresIn?: DurationString;
};

export type UserAttributes = DatedAttributes & {
  profile?: Profile;
};

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;