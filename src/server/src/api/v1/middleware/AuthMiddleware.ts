import { RequestHandler } from 'express';

import { AuthError } from '../../../services';
import { Jwt } from '../../../services/types';

export const authMiddleware: RequestHandler = (req, res, next) => {
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      try {
        req.body.jwt = Jwt.from(token);
        next();
      } catch (e) {
        if (e instanceof AuthError) {
          res.status(401).json(e);
        } else {
          console.log(e);
          res.status(500).end();
        }
      }
    } else {
      res.status(401).json({ error: 'Invalid or authorization header' });
    }
  } else {
    res.status(401).json({ error: 'Missing authorization header' });
  }
};