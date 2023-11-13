import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { AccountController } from '../../controllers';
import {
  authMiddleware,
  internalErrorHandler,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.post(
  '/register',
  oneOf([
    body('email').isEmail(),
    body('eth2address'),
    body('username').isString(),
    body('thirdParty').isObject(),
    body('anonymous').isString(),
  ]),
  body('password')
    .if(body('eth2address').not().exists())
    .if(body('thirdParty').not().exists())
    .if(body('anonymous').not().exists())
    .isString(),
  validationMiddleware,
  rateLimitMiddleware('2 per 5m'),
  async (req, res) => {
    try {
      const response = await AccountController.register(req, req.body);
      return res.status(201).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/login',
  oneOf([
    body('email').isEmail(),
    body('eth2address'),
    body('username').isString(),
    body('thirdParty').isObject(),
    body('anonymous').isString(),
  ]),
  body('password')
    .if(body('eth2address').not().exists())
    .if(body('thirdParty').not().exists())
    .if(body('anonymous').not().exists())
    .isString(),
  validationMiddleware,
  rateLimitMiddleware('2 per 5m'),
  async (req, res) => {
    try {
      const response = await AccountController.login(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/logout',
  body('force').isBoolean().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.logout(req, req.body);
      return res.status(204).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/otp',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.requestOtp(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/verify/alias',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.verifyAlias(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/verify/otp',
  body('otp').isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.verifyOtp(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.get(
  '/profile',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.getProfile(req);
      return res.status(200).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.patch(
  '/update/metadata',
  body('key').isString(),
  body('value').isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.updateMetadata(req, req.body);
      return res.status(200).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.put(
  '/update/credential', 
  rateLimitMiddleware('10 per 15m'),
  authMiddleware('jwt', { required: true, scope: ['account:write'] }),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.updateCredential(req, req.body);
      return res.status(200).json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

export default router;
