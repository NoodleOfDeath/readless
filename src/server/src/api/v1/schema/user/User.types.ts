import { ThirdParty } from './Alias.types';
import { DurationString } from '../../../../utils';
import { 
  DatedAttributes, 
  QueryOptions,
  UserAchievementAttributes,
} from '../types';

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

export type Achievements = {
  inProgress: UserAchievementAttributes[];
  completed: UserAchievementAttributes[];
  reputation: number;
};

export type UserStats = {
  memberSince?: Date;
  lastSeen?: Date;
  streak?: Streak;
  longestStreak?: Streak;
  daysActive: InteractionCount;
  interactionCounts?: {
    read: InteractionCount;
    share: InteractionCount;
  }
  achievements: UserAchievementAttributes[];
  reputation: number;
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

export type CalculateStreakOptions = QueryOptions & {
  longest?: boolean;
  expiresIn?: DurationString;
};

export type UserAttributes = DatedAttributes & {
  profile?: Profile;
};

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;