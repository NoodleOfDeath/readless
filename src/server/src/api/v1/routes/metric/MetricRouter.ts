import { Router } from 'express';
import { body } from 'express-validator';

import { MetricController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

const router = Router();

router.post(
  '/',
  body('type').isString(),
  body('data').isObject(),
  body('userAgent').isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      await MetricController.recordMetric({
        ...req.body,
        referrer: req.ips,
      });
      return res.status(200).send('OK');
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
