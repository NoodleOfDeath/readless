import express, { Router } from 'express';

import articleRouter from './routes/articles';
import authRouter from './routes/auth';
import bullBoardRouter from './routes/bull-board';
import metricRouter from './routes/metrics';
import newsletterRourer from './routes/newsletter';
import policyRouter from './routes/policies';
import referralRouter from './routes/referrals';
import sourceRouter from './routes/sources';
import { DBService } from '../../services';

const router = Router();

async function main() {
  await DBService.init();
  router.use(express.static('public'));
  router.use('/articles', articleRouter);
  router.use('/auth', authRouter);
  router.use('/bull-board', bullBoardRouter);
  router.use('/metrics', metricRouter);
  router.use('/newsletter', newsletterRourer);
  router.use('/policies', policyRouter);
  router.use('/referrals', referralRouter);
  router.use('/sources', sourceRouter);
  router.get('/healthz', (_, res) => res.send('OK'));
}

main();

export default router;
