import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware';
import { RequestController } from '../../controllers';

const router = Router();

router.post(
  '/', 
  body('ref').isString(),
  validate,
  async (req, res) => {
    const { ref } = req.body;
    try {
      await RequestController.record(ref);
      res.status(200).send('OK');
    } catch(e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);