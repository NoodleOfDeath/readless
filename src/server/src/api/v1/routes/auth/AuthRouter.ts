import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { AuthController } from '../../controllers';
import { AuthError } from './../../../../services/types';
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
        res.status(401).send(e.message);
      } else {
        console.log(e);
        res.status(500).send('Internal Server Error');
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
      console.log(e);
      res.status(500).send('Internal Server Error');
    }
  },
);

export default router;
