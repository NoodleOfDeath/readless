import { Router } from 'express';
import { query } from 'express-validator';

import { CategoryController } from '../../controllers';
import { 
  internalErrorHandler,
  paginationMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  query('filter').isString().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    try {
      await CategoryController.getCategories(req.body);
      return res.status(200).send('OK');
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
