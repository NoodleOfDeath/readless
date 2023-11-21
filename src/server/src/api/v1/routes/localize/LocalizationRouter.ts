import { Router } from 'express';
import { body } from 'express-validator';

import { LocalizationController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.post(
  '/',
  rateLimitMiddleware('30 per 1m'),
  body('resourceType').matches(/^(recap|summary)$/i),
  body('resourceId').isNumeric(),
  body('locale').isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await LocalizationController.localize(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
