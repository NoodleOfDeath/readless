import { RequestHandler } from 'express';

import { Request } from '../schema';

export const logRequest: RequestHandler = async (req, res, next) => {
  try {
    const request = new Request({
      remoteAddr: req.ip,
      referrer: req.get('Referrer'),
      path: req.path,
      method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      params: req.params,
      query: req.query,
      body: req.body,
    });
    console.log(request);
    await request.save();
  } catch (e) {
    console.error(e);
  }
  next();
};