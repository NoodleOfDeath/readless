import { Router } from 'express';
import { query } from 'express-validator';

import { StatusController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

const router = Router();

router.get(
  '/',
  query('filter').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await StatusController.getStatuses(req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.get(
  '/:name',
  query('filter').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await StatusController.getStatus(req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
