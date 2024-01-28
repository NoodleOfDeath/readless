import { Router } from 'express';
import {
  body,
  param,
  query,
} from 'express-validator';

import { PublisherController } from '../../controllers';
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
      const response = await PublisherController.getPublishers(req);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/interact/:target/:type',
  rateLimitMiddleware('30 per 1m'),
  param('target').isString(),
  param('type').isString(),
  body('value').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { target, type } = req.params;
      const interactions = await PublisherController.interactWithPublisher(req, target, type, req.body);
      return res.json(interactions);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
