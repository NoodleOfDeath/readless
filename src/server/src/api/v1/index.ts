import { Router } from 'express';

import accountRouter from './routes/account';
import articleRouter from './routes/article';
import documentRouter from './routes/document';
import metricRouter from './routes/metric';
import newsletterRourer from './routes/newsletter';
import openapiRouter from './routes/openapi';
import referralRouter from './routes/referral';
import sourceRouter from './routes/source';

const router = Router();

router.use('/account', accountRouter);
router.use('/article', articleRouter);
router.use('/document', documentRouter);
router.use('/metric', metricRouter);
router.use('/newsletter', newsletterRourer);
router.use('/openapi', openapiRouter);
router.use('/referral', referralRouter);
router.use('/source', sourceRouter);
router.get('/healthz', (_, res) => res.send('OK'));

export default router;
