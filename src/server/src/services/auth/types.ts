import { DestructuredCredentialPayload } from '../../api/v1/schema/auth/credential.types';
import { DestructuredAliasPayload  } from '../../api/v1/schema/user/alias.types';

export * from './jwt';

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
  userId?: number; 
}

export type LogoutResponse = {
  success: boolean;
  count: number;
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

export const OTP_LENGTH = 16;

export const VERIFICATION_CODE_LENGTH = 10;
