import { Router } from 'express';
import { body, oneOf } from 'express-validator';

import { NewsletterController } from '../../controllers';
import { internalErrorHandler, validationMiddleware } from '../../middleware';

const router = Router();

router.post(
  '/subscribe',
  body('aliasType').isString(),
  body('alias').isString(),
  oneOf([body('newsletterId').isNumeric(), body('newsletterName').isString()]),
  validationMiddleware,
  async (req, res) => {
    const {
      aliasType, alias, newsletterId, newsletterName, 
    } = req.body;
    try {
      await NewsletterController.subscribeToNewsletter({
        alias,
        aliasType,
        newsletterId,
        newsletterName,
      });
      return res.status(204).send('OK');
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

router.post(
  '/unsubscribe',
  body('aliasType').isString(),
  body('alias').isString(),
  oneOf([body('newsletterId').isNumeric(), body('newsletterName').isString()]),
  validationMiddleware,
  async (req, res) => {
    const {
      aliasType, alias, newsletterId, newsletterName, 
    } = req.body;
    try {
      await NewsletterController.unsubscribeFromNewsletter({
        alias,
        aliasType,
        newsletterId,
        newsletterName,
      });
      return res.status(204).send('OK');
    } catch (e) {
      internalErrorHandler(res, e);
    }
  }
);

export default router;
