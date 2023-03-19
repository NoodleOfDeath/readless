import { Router } from 'express';

import { AuthError } from '../../../../services';
import { AccountController } from '../../controllers';
import { authMiddleware, validationMiddleware } from '../../middleware';

const router = Router();

router.put(
  '/update', 
  authMiddleware,
  validationMiddleware,
  async (req, res) => {
    try {
      const response = new AccountController().updateAccount(req.body);
      res.status(200).json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
        return;
      }
      console.error(e);
      res.status(500).json(e);
    }
  }
);

export default router;
