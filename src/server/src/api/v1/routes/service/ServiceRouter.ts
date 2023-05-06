import { Router } from 'express';

import { ServiceController } from '../../controllers';
import { internalErrorHandler } from '../../middleware';

const router = Router();

router.get(
  '/',
  async (req, res) => {
    try {
      const response = await ServiceController.getServices();
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
