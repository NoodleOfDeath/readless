
import { ResourceType } from './../../api/v1/schema/types';
import { DestructuredCredentialPayload } from '../../api/v1/schema/auth/credential.types';
import { DestructuredAliasPayload  } from '../../api/v1/schema/user/alias.types';

export type RegistrationRequest = DestructuredAliasPayload & DestructuredCredentialPayload;
export type RegistrationResponse = {
  userId: number;
  jwt?: string;
}

export type LoginRequest = DestructuredAliasPayload & DestructuredCredentialPayload;

export type LoginResponse = {
  userId: number;
  jwt: string;
}

export type LogoutRequest = DestructuredCredentialPayload & {
  userId: number; 
}

export type LogoutResponse = {
  success: boolean;
}

export type AuthenticationRequest = {
  userId: number;
  jwt: string;
};

export type AuthenticationResponse = {
  userId: number;
}

export type GenerateOTPRequest = Omit<DestructuredAliasPayload, 'otp'>;

export type GenerateOTPResponse = {
  success: boolean;
}

export type VerifyAliasRequest = {
  verificationCode: string;
}

export type VerifyAliasResponse = {
  success: boolean;
}

export type VerifyOTPRequest = DestructuredAliasPayload;

export type VerifyOTPResponse = {
  jwt: string;
  userId: number;
}

export type JwtScope = 'god' | 'default' | 'account' | `${ResourceType}.${number}`;
export type JwtBaseAccess = 'read' | 'write' | 'delete';
export type JwtAccess = JwtBaseAccess | `deny.${JwtBaseAccess}`;

export const JWT_LIFETIMES = {
  default: '1d',
  otp: '30m',
} as const;

export const JWT_SCOPES = {
  default: ['default'] as JwtScope[],
  otp: ['account'] as JwtScope[],
} as const;

export const VERIFICATION_CODE_LENGTH = 10;

export type JwtOptions = {
  userId: number;
  scopes?: JwtScope[];
  access?: JwtAccess[];
  expiresIn?: string;
}

export class Jwt {

  userId: number;
  scopes: JwtScope[];
  access: JwtAccess[];
  expiresIn: string;

  static get Lifetimes() {
    return JWT_LIFETIMES; 
  }

  static get Scopes() {
    return JWT_SCOPES;
  }

  static Default(userId: number) {
    return new Jwt({
      access: ['read', 'write'],
      expiresIn: JWT_LIFETIMES.default,
      scopes: JWT_SCOPES.default,
      userId,
    }).toJSON();
  }

  static OTP(userId: number) {
    return new Jwt({
      access: ['read', 'write'],
      expiresIn: JWT_LIFETIMES.otp,
      scopes: JWT_SCOPES.otp,
      userId,
    }).toJSON();
  }

  constructor({
    userId,
    scopes = [],
    access = [],
    expiresIn = JWT_LIFETIMES.default,
  }: JwtOptions) {
    this.userId = userId;
    this.scopes = scopes;
    this.access = access;
    this.expiresIn = expiresIn;
  }

  toJSON() {
    return {
      access: this.access,
      expiresIn: this.expiresIn,
      scopes: this.scopes,
      userId: this.userId,
    };
  }

}