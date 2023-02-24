import { RequestHandler } from 'express';
import { ReferralController } from '../controllers';

export const referralHandler: RequestHandler = async (req, res, next) => {
  const { ref } = req.query;
  if (ref) {
    await ReferralController.record(ref as string, req.path);
  }
  next();
}