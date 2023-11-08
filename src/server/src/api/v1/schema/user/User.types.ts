import { DatedAttributes } from '../types';

export type Profile = {
  email: string;
  emails?: string[];
  username?: string;
  firstName?: string;
};

export type UserAttributes = DatedAttributes & {
  profile?: Profile;
};

export type UserCreationAttributes = Omit<DatedAttributes, 'id'>;