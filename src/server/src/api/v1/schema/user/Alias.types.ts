import { DatedAttributes } from '../types';

export const THIRD_PARTIES = { google: 'google' } as const;

export type ThirdParty = typeof THIRD_PARTIES[keyof typeof THIRD_PARTIES];

export type ThirdPartyAuth = {
  name: ThirdParty;
  userId?: number | string;
  credential?: string;
};

export const ALIAS_TYPES = {
  email: 'email',
  eth2Address: 'eth2Address',
  jwt: 'jwt',
  otp: 'otp',
  phone: 'phone',
  thirdParty: 'thirdParty',
  userId: 'userId',
  username: 'username',
} as const;

export type AliasType = typeof ALIAS_TYPES[keyof typeof ALIAS_TYPES] | `thirdParty/${ThirdParty}`;

export type DestructuredAliasPayload = {
  [key in AliasType]?: key extends 'thirdParty' ? ThirdPartyAuth : key extends 'userId' ? number | string : string;
};

export type AliasPayload = DestructuredAliasPayload & {
  type?: AliasType;
  value?: string | number | ThirdPartyAuth;
};

export type FindAliasOptions = {
  ignoreIfNotResolved?: boolean;
  skipVerification?: boolean;
};

export type AliasAttributes = DatedAttributes & {
  userId: number;
  type: AliasType;
  value: string;
  priority: number;
  verificationCode?: string;
  verificationExpiresAt?: Date;
  verifiedAt?: Date;
};

export type AliasCreationAttributes = {
  userId: number;
  type: AliasType;
  value: string;
  priority?: number;
  verificationCode?: string;
  verificationExpiresAt?: Date;
  verifiedAt?: Date;
};
