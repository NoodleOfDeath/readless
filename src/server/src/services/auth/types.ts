import { DestructuredCredentialPayload } from '../../api/v1/schema/auth/Credential.types';
import { DestructuredAliasPayload  } from '../../api/v1/schema/user/Alias.types';

export * from './jwt';

export type RegistrationRequest = DestructuredAliasPayload & DestructuredCredentialPayload;
export type RegistrationResponse = {
  userId: number;
  token?: {
    priority: number;
    value: string;
  };
}

export type LoginRequest = DestructuredAliasPayload & DestructuredCredentialPayload & {
  requestedRole?: string;
  requestedScope?: string[];
}

export type LoginResponse = {
  userId: number;
  token: {
    priority: number;
    value: string;
  };
}

export type LogoutRequest = {
  userId?: number;
  token?: string;
}

export type LogoutResponse = {
  success: boolean;
  count: number;
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
  token: {
    priority: number;
    value: string;
  };
  userId: number;
}

export const OTP_LENGTH = 16;

export const VERIFICATION_CODE_LENGTH = 10;
