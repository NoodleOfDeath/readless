import { Router } from 'express';
import { query } from 'express-validator';

import { OutletController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

const router = Router();

router.get(
  '/',
  query('filter').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await OutletController.getOutlets(req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
