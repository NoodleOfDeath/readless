import { Router } from 'express';

import { SubscribeController } from '../../controllers';
import { internalErrorHandler, rateLimitMiddleware } from '../../middleware';

const router = Router();

router.post(
  '/',
  rateLimitMiddleware('1 per 2s'),
  async (req, res) => {
    try {
      const response = await SubscribeController.subscribe(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/unsubscribe',
  rateLimitMiddleware('1 per 2s'),
  async (req, res) => {
    try {
      const response = await SubscribeController.unsubscribe(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
