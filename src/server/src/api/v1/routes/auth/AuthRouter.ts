import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { AuthController } from '../../controllers';
import { AuthError } from './../../../../services';
import { validate } from '../../middleware';

const router = Router();

router.post(
  '/login',
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
  validate,
  async (req, res) => {
    try {
      const response = await new AuthController().login(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  },
);

router.post(
  '/register',
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
  validate,
  async (req, res) => {
    try {
      const response = await new AuthController().register(req.body);
      res.status(201).json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  },
);

router.post(
  '/logout',
  body('userId').isInt().optional(),
  body('email').isEmail().optional(),
  body('eth2address').isString().optional(),
  body('username').isString().optional(),
  body('thirdParty').isObject().optional(),
  body('jwt').isString().optional(),
  validate,
  async (req, res) => {
    try {
      const response = await new AuthController().logout(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  },
);

router.post(
  '/authenticate',
  oneOf([
    body('jwt').isString(),
    body('thirdParty').isObject(),
  ]),
  validate,
  async (req, res) => {
    try {
      const response = await new AuthController().authenticate(req.body);
      res.json(response);
    } catch (e) {
      if (e instanceof AuthError) {
        res.status(401).json(e);
      } else {
        console.log(e);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  },
);

export default router;
