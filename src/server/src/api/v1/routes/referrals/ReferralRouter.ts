import { Router } from 'express';
import { body } from 'express-validator';

import { ReferralController } from '../../controllers';
import { validate } from '../../middleware';

const router = Router();

router.post(
  '/',
  body('referrer').isString(),
  body('target').isString(),
  body('userAgent').isString(),
  body('referredById').isString().optional(),
  body('origin').isString().optional(),
  body('geolocation').isString().optional(),
  validate,
  async (req, res) => {
    const {
      referredById, origin, target, userAgent, geolocation, 
    } = req.body;
    try {
      await new ReferralController().recordReferral({
        geolocation,
        origin,
        referredById,
        remoteAddr: req.ip,
        target,
        userAgent,
      });
      res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  }
);

export default router;
