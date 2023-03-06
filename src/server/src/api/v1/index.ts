import express, { Router } from 'express';

import { DBService } from '../../services';

import arenaRouter from './routes/arena';
import articleRouter from './routes/articles';
import metricRouter from './routes/metrics';
import policyRouter from './routes/policies';
import referralRouter from './routes/referrals';
import sourceRouter from './routes/sources';

const router = Router();

async function main() {
  await DBService.init();
  router.use(express.static('public'));
  router.use('/arena', arenaRouter);
  router.use('/articles', articleRouter);
  router.use('/metrics', metricRouter);
  router.use('/policies', policyRouter);
  router.use('/referrals', referralRouter);
  router.use('/sources', sourceRouter);
  router.get('/healthz', (_, res) => res.send('OK'));
}

main();

export default router;
