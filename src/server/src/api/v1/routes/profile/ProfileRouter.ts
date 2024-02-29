import { Router } from 'express';

import { ProfileController } from '../../controllers';
import { 
  authMiddleware,
  internalErrorHandler,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.get(
  '/',
  authMiddleware({ scope: ['standard:read'] }),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await ProfileController.getProfile(req);
      return res.status(200).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.get(
  '/achievements',
  authMiddleware({ scope: ['standard:read'] }),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await ProfileController.getAchievements(req);
      return res.status(200).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.get(
  '/stats',
  authMiddleware({ scope: ['standard:read'] }),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await ProfileController.getUserStats(req);
      return res.status(200).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

export default router;
