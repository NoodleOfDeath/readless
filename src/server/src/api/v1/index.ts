import { Router } from 'express';

import accountRouter from './routes/account';
import articleRouter from './routes/article';
import docsRouter from './routes/docs';
import metricRouter from './routes/metric';
import newsletterRourer from './routes/newsletter';
import policyRouter from './routes/policy';
import referralRouter from './routes/referral';
import sourceRouter from './routes/source';

const router = Router();

router.use('/account', accountRouter);
router.use('/article', articleRouter);
router.use('/metric', metricRouter);
router.use('/newsletter', newsletterRourer);
router.use('/policy', policyRouter);
router.use('/referral', referralRouter);
router.use('/source', sourceRouter);
router.use('/docs', docsRouter);
router.get('/healthz', (_, res) => res.send('OK'));

export default router;
