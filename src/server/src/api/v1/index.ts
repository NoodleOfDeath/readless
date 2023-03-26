import { Router } from 'express';

import accountRouter from './routes/account';
import metricRouter from './routes/metric';
import newsletterRourer from './routes/newsletter';
import openapiRouter from './routes/openapi';
import summaryRouter from './routes/summary';

const router = Router();

router.use('/account', accountRouter);
router.use('/metric', metricRouter);
router.use('/newsletter', newsletterRourer);
router.use('/openapi', openapiRouter);
router.use('/summary', summaryRouter);
router.get('/healthz', (_, res) => res.send('OK'));

export default router;
