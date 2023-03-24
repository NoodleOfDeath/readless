import { Router } from 'express';

import { DocumentController } from '../../controllers';

const router = Router();

router.get('/privacy', async (req, res) => {
  const controller = new DocumentController();
  try {
    const document = await controller.getPrivacyPolicy();
    res.json(document);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

router.get('/terms', async (req, res) => {
  const controller = new DocumentController();
  try {
    const document = await controller.getTermsOfService();
    res.json(document);
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

export default router;
