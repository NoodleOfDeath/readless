class ErrorMessage<Params extends Record<string, string>> {

  message: string;
  params?: Params;
  constructor(message: string, params?: Params) {
    this.message = message;
    this.params = params;
  }

}

const ERROR_MESSAGES = {
  DUPLICATE_USER: new ErrorMessage('User already exists'),
  EXPIRED_CREDENTIALS: new ErrorMessage('Credential has expired'),
  EXPIRED_VERIFICATION_CODE: new ErrorMessage('Verification code has expired'),
  INVALID_CREDENTIALS: new ErrorMessage('Credential is invalid'),
  INVALID_PASSWORD: new ErrorMessage('Email or password is incorrect'),
  MISSING_PASSWORD: new ErrorMessage('User does not have a password set. Please use a third party login method or request OTP.'),
  NO_THIRD_PARTY_ALIAS: new ErrorMessage('Google account does not have an email address'),
  STALE_VERIFICATION_CODE: new ErrorMessage('That verification token has already been used'),
  THIRD_PARTY_ALIAS_NOT_VERIFIED: new ErrorMessage('Google account email is not verified'),
  UNKNOWN_ALIAS: new ErrorMessage<{alias: string}>('Unable to find a user with the specified {alias}'),
};

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
    params?: typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES]['params']
  ) {
    let message: string = ERROR_MESSAGES[errorKey].message;
    if (params) {
      Object.keys(params).forEach(key => {
        message = message.replaceAll(`{${key}}`, params[key]);
      });
    }
    super(message);
    this.errorKey = errorKey;
    this.code = Object.keys(ERROR_MESSAGES).indexOf(errorKey) + 1,
    this.message = message;
  }
  
}