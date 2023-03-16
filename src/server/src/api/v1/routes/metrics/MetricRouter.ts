import { Router } from 'express';
import { body } from 'express-validator';

import { MetricController } from '../../controllers';
import { validate } from '../../middleware';

const router = Router();

router.post(
  '/',
  body('type').isString(),
  body('data').isObject(),
  body('userAgent').isString(),
  validate,
  async (req, res) => {
    const {
      type, data, userAgent, 
    } = req.body;
    try {
      await new MetricController().recordMetric({
        type,
        data,
        referrer: req.ips,
        userAgent,
      });
      res.status(200).send('OK');
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

export default router;
