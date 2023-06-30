import { Router } from 'express';

import accountRouter from './routes/account';
import categoryRouter from './routes/category';
import iapRouter from './routes/iap';
import openapiRouter from './routes/openapi';
import outletRouter from './routes/outlet';
import serviceRouter from './routes/service';
import subscribeRouter from './routes/subscribe';
import summaryRouter from './routes/summary';

const router = Router();

router.use('/account', accountRouter);
router.use('/category', categoryRouter);
router.use('/iap', iapRouter);
router.use('/openapi', openapiRouter);
router.use('/outlet', outletRouter);
router.use('/service', serviceRouter);
router.use('/subscribe', subscribeRouter);
router.use('/summary', summaryRouter);
router.get('/healthz', (_, res) => res.send('OK'));

export default router;
