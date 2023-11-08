import {
  JwtRequest,
  JwtResponse,
  WrappedJwt,
} from './jwt';
import { Profile } from '../../schema';
import { DestructuredAliasPayload  } from '../../schema/user/Alias.types';
import { DestructuredCredentialPayload } from '../../schema/user/Credential.types';

export * from './jwt';

export type LoginRequest = JwtRequest & DestructuredAliasPayload & DestructuredCredentialPayload & {
  createIfNotExists?: boolean;
  requestedRole?: string;
  requestedScope?: string[];
};

export type LoginResponse = JwtResponse & {
  profile?: Profile;
};

export type LogoutRequest = JwtRequest & {
  force?: boolean;
};

export type LogoutResponse = Partial<JwtResponse> & {
  success: boolean;
  count: number;
};

export type RegistrationRequest = JwtRequest & DestructuredAliasPayload & DestructuredCredentialPayload;

export type RegistrationResponse = Omit<JwtResponse, 'token'> & {
  token?: WrappedJwt;
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
  token: WrappedJwt;
  userId: number;
};

export type UpdateCredentialRequest = {
  userId: number;
  password: string;
};

export type UpdateCredentialResponse = {
  success: boolean;
};

export const OTP_LENGTH = 16;

export const VERIFICATION_CODE_LENGTH = 10;
