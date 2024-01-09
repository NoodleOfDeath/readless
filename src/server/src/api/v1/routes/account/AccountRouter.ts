import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { AccountController, ProfileController } from '../../controllers';
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
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.register(req, req.body);
      await t.commit();
      return res.status(201).json(response);
    } catch (e) {
      await t.rollback();
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
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.login(req, req.body);
      await t.commit();
      return res.json(response);
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/logout',
  body('force').isBoolean().optional(),
  validationMiddleware,
  async (req, res) => {
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.logout(req, req.body);
      await t.commit();
      return res.status(204).json(response);
    } catch (e) {
      await t.rollback();
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
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.registerAlias(req, req.body);
      await t.commit();
      return res.json(response);
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/alias/unregister',
  body('otherAlias').isObject(),
  validationMiddleware,
  async (req, res) => {
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.unregisterAlias(req, req.body);
      await t.commit();
      return res.json(response);
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/alias/verify',
  validationMiddleware,
  async (req, res) => {
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.verifyAlias(req, req.body);
      await t.commit();
      return res.json(response);
    } catch (e) {
      await t.rollback();
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
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.requestOtp(req, req.body);
      await t.commit();
      return res.json(response);
    } catch (e) {
      await t.rollback();
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
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.verifyOtp(req, req.body);
      await t.commit();
      return res.json(response);
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

// legacy v1.17.9
router.get(
  '/profile',
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

// legacy v1.17.9
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

router.patch(
  '/metadata',
  body('key').isString(),
  body('value').isString(),
  body('type').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.updateMetadata(req, req.body);
      await t.commit();
      return res.status(200).json(response);
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

router.put(
  '/credential', 
  rateLimitMiddleware('5 per 3m'),
  authMiddleware('jwt', { required: true, scope: ['account:write'] }),
  validationMiddleware,
  async (req, res) => {
    const t = await AccountController.store.transaction();
    try {
      const response = await AccountController.updateCredential(req, req.body);
      await t.commit();
      return res.status(200).json(response);
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

router.delete(
  '/',
  rateLimitMiddleware('5 per 3m'),
  body('userId').isNumeric().optional(),
  body('password').isString().optional(),
  validationMiddleware,
  async (req, res) => {
    const t = await AccountController.store.transaction();
    try {
      await AccountController.deleteAccount(req, req.body);
      await t.commit();
      return res.status(204).send();
    } catch (e) {
      await t.rollback();
      return internalErrorHandler(res, e);
    }
  }
);

export default router;
