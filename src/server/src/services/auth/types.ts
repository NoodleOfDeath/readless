import { AliasType, CredentialType } from '../../api/v1/schema/types';

export const THIRD_PARTIES = { google: 'google' } as const;

export type ThirdParty = typeof THIRD_PARTIES[keyof typeof THIRD_PARTIES];

export type ThirdPartyAuth = {
  name: ThirdParty;
  credential?: string;
};

export type AliasOptions = {
  [key in AliasType]: key extends 'thirdParty' ? ThirdPartyAuth : string;
};

export type CredentialOptions = {
  [key in CredentialType]: string;
};

export type AliasTicketOptions<T extends AliasType> = {
  type: T;
  payload: T extends 'thirdParty' ? ThirdPartyAuth : string;
};

export class AliasTicket<T extends AliasType> implements AliasTicketOptions<T> {

  type: T;
  payload: T extends 'thirdParty' ? ThirdPartyAuth : string;
  constructor({ type, payload }: AliasTicketOptions<T>) {
    this.type = type;
    this.payload = payload;
  }

}

export type RegistrationOptions = AliasOptions & CredentialOptions & {
  headlessRequest: boolean;
};

export type RegistrationResponse = {
  userId: number;
  jwt?: string;
}

export type LoginOptions = AliasOptions & CredentialOptions;

export type LoginResponse = {
  userId: number;
  jwt: string;
}

export type LogoutOptions = CredentialOptions & {
  userId: number; 
}

export type LogoutResponse = {
  success: boolean;
}

export type AuthenticationOptions = LoginOptions & {
  jwt: string;
};

export type AuthenticationResponse = {
  userId: number;
}
