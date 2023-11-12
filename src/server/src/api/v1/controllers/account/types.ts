import {
  JwtRequest,
  JwtResponse,
  WrappedJwt,
} from './jwt';
import { Profile } from '../../schema';
import { DestructuredAliasPayload  } from '../../schema/user/Alias.types';
import { DestructuredCredentialPayload } from '../../schema/user/Credential.types';

export * from './jwt';

export type ProfileRequest = JwtRequest;

export type ProfileResponse = {
  profile?: Profile;
};

export type LoginRequest = JwtRequest & DestructuredAliasPayload & DestructuredCredentialPayload & {
  createIfNotExists?: boolean;
  anonymous?: string;
  requestedRole?: string;
  requestedScope?: string[];
};

export type LoginResponse = JwtResponse & ProfileResponse & {
  unlinked?: boolean;
};

export type LogoutRequest = JwtRequest & {
  force?: boolean;
};

export type LogoutResponse = Partial<JwtResponse> & {
  success: boolean;
  count: number;
};

export type RegistrationRequest = JwtRequest & DestructuredAliasPayload & DestructuredCredentialPayload & {
  anonymous?: string;
};

export type RegistrationResponse = Omit<JwtResponse, 'token'> & {
  token?: WrappedJwt;
};

export type RequestOtpRequest = Omit<DestructuredAliasPayload, 'otp'>;

export type RequestOtpResponse = {
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

export type UpdateMetadataRequest = JwtRequest & {
  key: string;
  value: Record<string, unknown>;
};

export type UpdateMetadataResponse = {
  success: boolean;
};

export type UpdateCredentialRequest = JwtRequest & {
  password: string;
};

export type UpdateCredentialResponse = {
  success: boolean;
};

export const OTP_LENGTH = 16;

export const VERIFICATION_CODE_LENGTH = 10;
