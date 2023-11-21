import { ThirdParty } from './Alias.types';
import { DatedAttributes } from '../types';

export type UserEvent<T> = { 
  user?: string; 
  userId?: number;
  count?: number;
  rank?: number; 
  createdAt?: Date;
} & T;

export type Streak = UserEvent<{
  start: Date;
  end: Date;
  length: number;
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

export type UserAttributes = DatedAttributes & {
  profile?: Profile;
};

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;