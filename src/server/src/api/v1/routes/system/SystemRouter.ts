import { Router } from 'express';
import { query } from 'express-validator';

import { SystemController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/notifications',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await SystemController.getSystemNotifications(req);
      return res.status(200).json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.get(
  '/sitemap',
  rateLimitMiddleware('5 per 1m'),
  query('forceCache').isBoolean().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await SystemController.getSitemap(req);
      res.setHeader('Content-Type', 'application/xml');
      return res.send(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
