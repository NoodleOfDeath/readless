import { Router } from 'express';
import { body } from 'express-validator';

import { SubscribeController } from '../../controllers';
import { internalErrorHandler, rateLimitMiddleware } from '../../middleware';

const router = Router();

router.post(
  '/',
  body('channel').isString().notEmpty(),
  body('uuid').isString().notEmpty(),
  body('event').isString().notEmpty(),
  rateLimitMiddleware('2 per 1m'),
  async (req, res) => {
    try {
      const response = await SubscribeController.subscribe(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/verify',
  body('channel').isString().notEmpty(),
  body('uuid').isString().notEmpty(),
  body('event').isString().notEmpty(),
  body('verificationCode').isString().notEmpty(),
  rateLimitMiddleware('5 per 1m'),
  async (req, res) => {
    try {
      const response = await SubscribeController.verify(req, req.body);
      return res.json(response);
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/unsubscribe',
  body('channel').isString().notEmpty(),
  body('uuid').isString().notEmpty(),
  body('event').isString().notEmpty(),
  body('verificationCode').isString().notEmpty(),
  rateLimitMiddleware('5 per 1m'),
  async (req, res) => {
    try {
      await SubscribeController.unsubscribe(req, req.body);
      return res.status(200).send();
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
