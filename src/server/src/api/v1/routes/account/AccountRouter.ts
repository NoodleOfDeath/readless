import { Router } from 'express';

import { AuthError } from '../../../../services';
import { AccountController } from '../../controllers';
import { authMiddleware, validationMiddleware } from '../../middleware';

const router = Router();

router.put(
  '/update/credential', 
  authMiddleware('jwt', { required: true, scope: ['account:write'] }),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = new AccountController().updateCredential(req.body);
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
