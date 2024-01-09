import { Router } from 'express';

import { ProfileController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

const router = Router();

router.get(
  '/',
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
