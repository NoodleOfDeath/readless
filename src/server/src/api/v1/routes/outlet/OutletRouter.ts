import { Router } from 'express';
import { body } from 'express-validator';

import { OutletController } from '../../controllers';
import { 
  internalErrorHandler,
  paginationMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.post(
  '/',
  body('filter').isString().optional(),
  ...paginationMiddleware,
  validationMiddleware,
  async (req, res) => {
    try {
      await OutletController.getOutlets(req.body);
      return res.status(200).send('OK');
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
