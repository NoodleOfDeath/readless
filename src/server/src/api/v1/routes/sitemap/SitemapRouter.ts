import { Router } from 'express';
import { query } from 'express-validator';

import { SitemapController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  rateLimitMiddleware('5 per 1m'),
  query('forceCache').isBoolean().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await SitemapController.getSitemap(req);
      res.setHeader('Content-Type', 'application/xml');
      return res.send(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
