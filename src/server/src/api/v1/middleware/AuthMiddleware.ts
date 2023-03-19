import { RequestHandler } from 'express';

import { AuthError, AuthService } from '../../../services';

export const authMiddleware: RequestHandler = (req, res, next) => {
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      try {
        new AuthService().authenticate({ jwt: token });
      } catch (e) {
        if (e instanceof AuthError) {
          res.status(401).json(e);
        } else {
          console.log(e);
          res.status(500).end();
        }
        return;
      }
      next();
    } else {
      res.status(401).json({ error: 'Invalid authorization header' });
    }
  }
  res.status(401).json({ error: 'Missing authorization header' });
};