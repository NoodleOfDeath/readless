import { Response } from 'express';

import { randomString } from '../../../utils';

export const internalErrorHandler = (res: Response, error: Error | string) => {
  const nonce = [randomString(64), new Date().toString()].join(' §§ ');
  const message = [typeof error === 'string' ? error : error.message, nonce].join(' §§ ');
  console.error(message);
  res.status(500).json(new Error(`Unknown Error: ${nonce}`));
};