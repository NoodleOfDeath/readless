import { Router } from 'express';
import { body } from 'express-validator';

import { ServiceController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  async (req, res) => {
    try {
      const response = await ServiceController.getServices();
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.get(
  '/messages',
  async (req, res) => {
    try {
      const response = await ServiceController.getSystemMessages();
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/localize',
  rateLimitMiddleware('10 per 1m'),
  body('resourceType').matches(/^(summary)$/i),
  body('resourceId').isNumeric(),
  body('locale').isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await ServiceController.localize(req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/tts',
  rateLimitMiddleware('10 per 1m'),
  body('resourceType').matches(/^(summary)$/i),
  body('resourceId').isNumeric(),
  body('voice').isString().optional(),
  body('quality').isString().matches(/low|medium|high/).optional(),
  body('speed').isNumeric().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await ServiceController.tts(req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
