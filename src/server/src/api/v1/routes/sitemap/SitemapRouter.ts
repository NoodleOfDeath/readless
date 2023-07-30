import { Router } from 'express';
import { query } from 'express-validator';

import { SitemapController } from '../../controllers';
import { internalErrorHandler, rateLimitMiddleware } from '../../middleware';

const router = Router();

router.get(
  '/',
  query('forceCache').isBoolean().optional(),
  rateLimitMiddleware('5 per 1m'),
  async (req, res) => {
    try {
      const response = await SitemapController.getSitemap(req);
      res.setHeader('Content-Type', 'application/xml');
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
