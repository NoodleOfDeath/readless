import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const validationMiddleware: RequestHandler = (req, resp, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp
      .status(400)
      .json(new InternalError(`Bad Request ${JSON.stringify(errors.array())}`);
    return;
  }
  next();
};
