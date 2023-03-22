import { DestructuredCredentialPayload } from '../../api/v1/schema/auth/Credential.types';
import { DestructuredAliasPayload  } from '../../api/v1/schema/user/Alias.types';

export * from './jwt';

export type JwtTokenResponse = {
  priority: number;
  value: string;
};

export type RegistrationRequest = DestructuredAliasPayload & DestructuredCredentialPayload;
export type RegistrationResponse = {
  userId: number;
  token?: JwtTokenResponse
};

export type LoginRequest = DestructuredAliasPayload & DestructuredCredentialPayload & {
  requestedRole?: string;
  requestedScope?: string[];
};

export type LoginResponse = {
  userId: number;
  token: JwtTokenResponse
};

export type LogoutRequest = {
  userId: number;
  token?: string;
  force?: boolean;
};

export type LogoutResponse = {
  success: boolean;
  count: number;
};

export type GenerateOTPRequest = Omit<DestructuredAliasPayload, 'otp'>;

export type GenerateOTPResponse = {
  success: boolean;
};

export type VerifyAliasRequest = {
  verificationCode: string;
};

export type VerifyAliasResponse = {
  success: boolean;
};

export type VerifyOTPRequest = DestructuredAliasPayload;

export type VerifyOTPResponse = {
  token: JwtTokenResponse
  userId: number;
};

export const OTP_LENGTH = 16;

export const VERIFICATION_CODE_LENGTH = 10;
