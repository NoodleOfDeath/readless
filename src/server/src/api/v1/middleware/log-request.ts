import { RequestHandler } from 'express';

import { Request } from '../schema/models';

export const logRequest: RequestHandler = async (req, res, next) => {
  try {
    const request = new Request({
      method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      path: req.path,
      referrer: req.get('Referrer'),
      remoteAddr: req.ip,
    });
    await request.save();
  } catch (e) {
    console.error(e);
  }
  next();
};