import { Router } from 'express';

import { MetricsController } from '../../controllers';
import {
  authMiddleware,
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  rateLimitMiddleware('1 per 2s'),
  authMiddleware({ scope: ['standard:read'] }),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await MetricsController.getMetricsInternal(req, req.query);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
