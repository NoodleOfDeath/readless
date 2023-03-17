import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { NewsletterController } from '../../controllers';
import { validate } from '../../middleware';

const router = Router();

router.post(
  '/subscribe',
  body('aliasType').isString(),
  body('alias').isString(),
  oneOf([body('newsletterId').isNumeric(), body('newsletterName').isString()]),
  validate,
  async (req, res) => {
    const {
      aliasType, alias, newsletterId, newsletterName, 
    } = req.body;
    try {
      await new NewsletterController().subscribeToNewsletter({
        alias,
        aliasType,
        newsletterId,
        newsletterName,
      });
      res.status(204).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  },
);

router.post(
  '/unsubscribe',
  body('aliasType').isString(),
  body('alias').isString(),
  oneOf([body('newsletterId').isNumeric(), body('newsletterName').isString()]),
  validate,
  async (req, res) => {
    const {
      aliasType, alias, newsletterId, newsletterName, 
    } = req.body;
    try {
      await new NewsletterController().unsubscribeFromNewsletter({
        alias,
        aliasType,
        newsletterId,
        newsletterName,
      });
      res.status(204).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  },
);

export default router;
