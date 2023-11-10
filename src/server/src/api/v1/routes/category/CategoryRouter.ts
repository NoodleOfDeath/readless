import { Router } from 'express';
import {
  body,
  param,
  query,
} from 'express-validator';

import { CategoryController } from '../../controllers';
import {
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  query('filter').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await CategoryController.getCategories(req);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/interact/:targetId/:type',
  rateLimitMiddleware('30 per 1m'),
  param('targetId').isNumeric(),
  param('type').isString(),
  body('value').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { targetId, type } = req.params;
      req.body.remoteAddr = req.ip;
      const interactions = await CategoryController.interactWithCategory(req, targetId, type, req.body);
      return res.json(interactions);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
