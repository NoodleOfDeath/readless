import { Router } from 'express';
import { body } from 'express-validator';

import { NewsletterController } from '../../controllers';
import { validate } from '../../middleware';

const router = Router();

router.post(
  '/',
  body('aliasType').isString(),
  body('alias').isString(),
  body('newsletterId').isNumeric(),
  validate,
  async (req, res) => {
    const { aliasType, alias, newsletterId } = req.body;
    try {
      await new NewsletterController().subscribeToNewsletter({
        aliasType,
        alias,
        newsletterId,
      });
      res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);

export default router;
