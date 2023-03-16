const ERROR_MESSAGES = {
  DUPLICATE_USER: { message: 'User already exists' },
  EXPIRED_CREDENTIALS: { message: 'Credential has expired' },
  INVALID_CREDENTIALS: { message: 'Password is incorrect' },
  MISSING_PASSWORD: { message: 'User does not have a password set. Please use a third party login method or request OTP.' },
  NO_THIRD_PARTY_ALIAS: { message: 'Google account does not have an email address' },
  THIRD_PARTY_ALIAS_NOT_VERIFIED: { message: 'Google account email is not verified' },
  UNKNOWN_ALIAS: { message: 'Unable to find a user with the specified alias' },
} as const;

type AuthErrorOptions = {
  code: number;
  message: string;
}

export class AuthError extends Error implements AuthErrorOptions {
  
  errorKey: keyof typeof ERROR_MESSAGES;
  code: number;
  message: string;
  
  constructor(
    errorKey: keyof typeof ERROR_MESSAGES, 
    { 
      code = Object.keys(ERROR_MESSAGES).indexOf(errorKey) + 1,
      message = ERROR_MESSAGES[errorKey].message,
    }: Partial<AuthErrorOptions> = {}) {
    super(message);
    this.errorKey = errorKey;
    this.code = code,
    this.message = message;
  }
  
}