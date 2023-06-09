import { Router } from 'express';

import { IapController } from '../../controllers';
import { internalErrorHandler } from '../../middleware';

const router = Router();

router.post(
  '/iap',
  async (req, res) => {
    try {
      const response = await IapController.processPurchase(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
