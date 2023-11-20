import { ThirdParty } from './Alias.types';
import { DatedAttributes } from '../types';

export type UserEventRaw = { userId: number; length: number; min: string, max: string };
export type UserEvent = { userId: number; length: number; start: Date, end: Date };

export const rawUserEventMap = (e: UserEventRaw) => ({ 
  end: new Date(e.max),
  length: e.length,
  start: new Date(e.min), 
  userId: e.userId,
}) as UserEvent;

export type Streak = {
  start: Date;
  end: Date;
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