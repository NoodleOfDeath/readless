import { ValuesOfKeys } from '../../../../types';
import { DatedAttributes } from '../types';

export const CREDENTIAL_TYPES = {
  eth2SignedMessage: 'eth2SignedMessage',
  jwt: 'jwt',
  otp: 'otp',
  password: 'password',
} as const;

export type CredentialType = ValuesOfKeys<typeof CREDENTIAL_TYPES>;

export type DestructuredCredentialPayload = {
  [key in CredentialType]: string;
};

export type CredentialAttributes = DatedAttributes & {
  userId: number; 
  type: CredentialType;
  value: string;
  expiresAt: Date;
};

export type CredentialCreationAttributes = DatedAttributes & {
  userId: number;
  type: CredentialType;
  value: string;
  expiresAt: Date;
};