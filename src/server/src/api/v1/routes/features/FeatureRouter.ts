import { Router } from 'express';
import { param } from 'express-validator';

import { FeatureController } from '../../controllers';
import { validate } from '../../middleware';

const router = Router();

router.get(
  '/',
  async (req, res) => {
    try {
      const features = await new FeatureController().getFeatures();
      res.json(features);
    } catch(e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);

router.get(
  '/:feature',
  param('feature').isString(),
  validate,
  async (req, res) => {
    const { feature: featureName } = req.params;
    try {
      const feature = await new FeatureController().getFeature(featureName);
      res.json(feature);
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Error');
    }
  },
);

export default router;
