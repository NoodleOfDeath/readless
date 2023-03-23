import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { AuthError } from '../../../../services';
import { AccountController } from '../../controllers';
import {
  authMiddleware,
  rateLimitMiddleware,
  validationMiddleware,
} from '../../middleware';

const router = Router();

router.post(
  '/register',
  authMiddleware('jwt'),
  oneOf([
    body('email').isEmail(),
    body('eth2address'),
    body('username').isString(),
    body('thirdParty').isObject(),
  ]),
  body('password')
    .if(body('eth2address').not().exists())
    .if(body('thirdParty').not().exists())
    .isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AccountController().register(req.body);
      res.status(201).json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/login',
  authMiddleware('jwt'),
  oneOf([
    body('email').isEmail(),
    body('eth2address'),
    body('username').isString(),
    body('thirdParty').isObject(),
  ]),
  body('password')
    .if(body('eth2address').not().exists())
    .if(body('thirdParty').not().exists())
    .isString(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AccountController().login(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/logout',
  authMiddleware('jwt'),
  body('userId').isInt().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AccountController().logout(req.body);
      res.status(204).json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/otp',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AccountController().generateOTP(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/verify/alias',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AccountController().verifyAlias(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
    }
  }
);

router.post(
  '/verify/otp',
  validationMiddleware,
  async (req, res) => {
    try {
      const response = await new AccountController().verifyOTP(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).end();
      }
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
