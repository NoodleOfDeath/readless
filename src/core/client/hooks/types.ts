import { InternalError } from '~/api';

export const CLIENT_ERRORS = {
  NOT_LOGGED_IN: 'NOT_LOGGED_IN',
  UNKNOWN: 'UNKNOWN ERROR',
} as const;

export type ClientErrorName = keyof typeof CLIENT_ERRORS;

export class ClientError extends Error implements InternalError {
  
  name: ClientErrorName;
  
  constructor(name: ClientErrorName, message?: unknown) {
    super((message instanceof Error ? message.message : typeof message === 'string' ? message : 'unknown error') ?? name);
    this.name = name;
  }

}