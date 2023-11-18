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
  rateLimitMiddleware('10 per 5m'),
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
  rateLimitMiddleware('10 per 5m'),
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
  '/alias/register',
  rateLimitMiddleware('5 per 5m'),
  body('otherAlias').isObject(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.registerAlias(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

// legacy v1.17.2
router.post(
  '/register/alias',
  rateLimitMiddleware('5 per 5m'),
  body('otherAlias').isObject(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.registerAlias(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/alias/unregister',
  body('otherAlias').isObject(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.unregisterAlias(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

// legacy v1.17.2
router.post(
  '/unregister/alias',
  body('otherAlias').isObject(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await AccountController.unregisterAlias(req, req.body);
      return res.json(response);
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/alias/verify',
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

// legacy v1.17.2
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
  '/otp',
  rateLimitMiddleware('5 per 5m'),
  body('deleteAccount').isBoolean().optional(),
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
  '/otp/verify',
  body('otp').isString(),
  body('deleteAccount').isBoolean().optional(),
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

// legacy v1.17.2
router.post(
  '/verify/otp',
  body('otp').isString(),
  body('deleteAccount').isBoolean().optional(),
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
  '/metadata',
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

// legacy v1.17.2
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
  '/credential', 
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

// legacy v1.17.2
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

router.delete(
  '/',
  // rateLimitMiddleware('1 per 3m'),
  body('userId').isNumeric().optional(),
  body('password').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      await AccountController.deleteAccount(req, req.body);
      return res.status(204).send();
    } catch (e) {
      return internalErrorHandler(res, e);
    }
  }
);

export default router;
