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
    const { aliasType, alias, newsletterId, newsletterName } = req.body;
    try {
      await new NewsletterController().subscribeToNewsletter({
        aliasType,
        alias,
        newsletterId,
        newsletterName,
      });
      res.status(204).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Error');
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
    const { aliasType, alias, newsletterId, newsletterName } = req.body;
    try {
      await new NewsletterController().unsubscribeFromNewsletter({
        aliasType,
        alias,
        newsletterId,
        newsletterName,
      });
      res.status(204).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);

export default router;
