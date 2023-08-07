import { Response } from 'express';

import { AuthError } from './AuthError';
import { InternalError } from './InternalError';
import { randomString } from '../../../../utils';

export const internalErrorHandler = (res: Response, error: Error | string) => {
  console.error(error);
  if (error instanceof InternalError && error.sensitive === false) {
    if (error instanceof AuthError) {
      return res.status(401).json(error);
    }
    return res.status(500).json(error);
  }
  const nonce = [randomString(64), new Date().toString()].join(' §§ ');
  return res.status(500).json(new Error(`Unknown Error: ${nonce}`));
};