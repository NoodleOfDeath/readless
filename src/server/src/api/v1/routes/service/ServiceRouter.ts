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

router.get(
  '/stream/s/:id',
  async (req, res) => {
    try {
      const { id } = req.params;
      return ServiceController.stream(req, Number(id));
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
      const response = await ServiceController.localize(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/tts',
  async (req, res) => {
    try {
      const response = await ServiceController.tts(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/iap',
  async (req, res) => {
    try {
      const response = await ServiceController.processPurchase(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
