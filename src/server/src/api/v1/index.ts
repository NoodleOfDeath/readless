import { Router } from 'express';

import accountRouter from './routes/account';
import categoryRouter from './routes/category';
import metricRouter from './routes/metric';
import newsletterRourer from './routes/newsletter';
import openapiRouter from './routes/openapi';
import outletRouter from './routes/outlet';
import statusRouter from './routes/status';
import summaryRouter from './routes/summary';
import versionRouter from './routes/version';

const router = Router();

router.use('/account', accountRouter);
router.use('/category', categoryRouter);
router.use('/metric', metricRouter);
router.use('/newsletter', newsletterRourer);
router.use('/openapi', openapiRouter);
router.use('/outlet', outletRouter);
router.use('/status', statusRouter);
router.use('/summary', summaryRouter);
router.use('/version', versionRouter);
router.get('/healthz', (_, res) => res.send('OK'));

export default router;
