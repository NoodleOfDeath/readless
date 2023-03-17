import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const validate: RequestHandler = (req, resp, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).send({
      errors: errors.array(),
      message: 'Bad Request',
    });
    return;
  }
  next();
};
