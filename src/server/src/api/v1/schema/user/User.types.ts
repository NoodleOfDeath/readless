import { DatedAttributes } from '../types';

export type Profile = {
  email: string;
  emails?: string[];
  username?: string;
  firstName?: string;
  lastName?: string;
  preferences?: { [key: string]: unknown };
  updatedAt?: Date;
};

export type UserAttributes = DatedAttributes & {
  profile?: Profile;
};

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;