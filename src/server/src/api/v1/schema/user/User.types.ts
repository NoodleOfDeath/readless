import { ThirdParty } from './Alias.types';
import { DatedAttributes } from '../types';

export type UserEventRaw = { userId: number; date: string };
export type UserEvent = { userId: number; date: Date };

export const rawUserEventMap = (e: UserEventRaw) => ({ date: new Date(e.date), userId: e.userId }) as UserEvent;

export type Streak = {
  start: Date;
  length: number;
};

export type UserStats = {
  lastSeen?: Date;
  streak?: Streak;
  longestStreak?: Streak;
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