import { InternalError } from './InternalError';

class ErrorMessage<Params extends Record<string, string>> {

  message: string;
  params?: Params;
  constructor(message: string, params?: Params) {
    this.message = message;
    this.params = params;
  }

}

const ERROR_MESSAGES = {
  ALIAS_UNVERIFIED: new ErrorMessage<{ alias: string; }>('Please verify this {alias} before logging in'),
  ALREADY_LOGGED_IN: new ErrorMessage('User is already logged in'),
  BAD_REQUEST: new ErrorMessage('Bad request'),
  DUPLICATE_USER: new ErrorMessage('User already exists'),
  EXPIRED_CREDENTIALS: new ErrorMessage('Credential has expired'),
  EXPIRED_VERIFICATION_CODE: new ErrorMessage('Verification code has expired'),
  INSUFFICIENT_PERMISSIONS: new ErrorMessage('Insufficient permissions'),
  INVALID_CREDENTIALS: new ErrorMessage('Unauthorized'),
  INVALID_PASSWORD: new ErrorMessage('Email or password is incorrect'),
  MISSING_AUTHORIZATION_HEADER: new ErrorMessage('Missing authorization header'),
  MISSING_PASSWORD: new ErrorMessage('User does not have a password set. Please use a third party login method or request a password reset.'),
  NO_THIRD_PARTY_ALIAS: new ErrorMessage('Google account does not have an email address'),
  STALE_VERIFICATION_CODE: new ErrorMessage('That verification token has already been used'),
  THIRD_PARTY_ALIAS_NOT_VERIFIED: new ErrorMessage('Google account email is not verified'),
  TOO_MANY_REQUESTS: new ErrorMessage('Too many requests'),
  UNAUTHORIZED: new ErrorMessage('Unauthorized'),
  UNKNOWN: new ErrorMessage('Unknown error'),
  UNKNOWN_ALIAS: new ErrorMessage<{alias: string}>('Unable to find a user with the specified {alias}'),
  UNKNOWN_ROLE: new ErrorMessage<{role: string}>('Unknown role: {role}'),
  UNREFRESHABLE_JWT: new ErrorMessage('JWT is not refreshable'),
};

type AuthErrorOptions = {
  code: number;
  statusCode: number;
  message: string;
};

export class AuthError extends InternalError implements AuthErrorOptions {
  
  errorKey: keyof typeof ERROR_MESSAGES;
  statusCode: number;
  message: string;
  
  constructor(
    errorKey: keyof typeof ERROR_MESSAGES,
    statusCodeOrParams: typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES]['params'] | number = 401,
    params: typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES]['params'] = typeof statusCodeOrParams === 'number' ? undefined : statusCodeOrParams
  ) {
    let message: string = ERROR_MESSAGES[errorKey].message;
    if (params) {
      Object.keys(params).forEach(key => {
        message = message.replaceAll(`{${key}}`, params[key]);
      });
    }
    super(message);
    this.errorKey = errorKey;
    if (typeof statusCodeOrParams === 'number') {
      this.statusCode = statusCodeOrParams;
    }
    this.code = Object.keys(ERROR_MESSAGES).indexOf(errorKey) + 1;
    this.message = message;
  }
  
}