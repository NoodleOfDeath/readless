import { Router } from 'express';

import { StatsController } from '../../controllers';
import { internalErrorHandler, rateLimitMiddleware } from '../../middleware';

const router = Router();

router.get(
  '/',
  rateLimitMiddleware('1 per 2s'),
  async (req, res) => {
    try {
      const response = await StatsController.getStats(req);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
