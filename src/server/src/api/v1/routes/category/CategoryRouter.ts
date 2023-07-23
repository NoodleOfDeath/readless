import { Router } from 'express';
import { query } from 'express-validator';

import { CategoryController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

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

export default router;
