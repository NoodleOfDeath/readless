import { Router } from 'express';

import { logRequest } from '../../middleware';
import { PolicyController } from '../../controllers';

const router = Router();

router.get('/privacy', logRequest, async (req, res) => {
  const controller = new PolicyController();
  try {
    const policy = await controller.getPrivacyPolicy();
    res.json(policy);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/terms', logRequest, async (req, res) => {
  const controller = new PolicyController();
  try {
    const policy = await controller.getTermsOfService();
    res.json(policy);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
