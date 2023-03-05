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
  validate,
  async (req, res) => {
    const { referrer, target, userAgent } = req.body;
    try {
      await new ReferralController().record({
        referrer,
        target,
        userAgent,
      });
      res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);

export default router;
