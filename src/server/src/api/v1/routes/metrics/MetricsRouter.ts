import { Router } from 'express';

import { MetricsController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  rateLimitMiddleware('1 per 2s'),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await MetricsController.getMetrics(req);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
