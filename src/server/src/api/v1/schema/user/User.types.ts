import { ThirdParty } from './Alias.types';
import { DatedAttributes } from '../types';

export type Profile = {
  email?: string;
  emails?: string[];
  pendingEmails?: string[];
  username?: string;
  linkedThirdPartyAccounts?: ThirdParty[];
  firstName?: string;
  lastName?: string;
  preferences?: { [key: string]: unknown };
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserAttributes = DatedAttributes & {
  profile?: Profile;
};

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;