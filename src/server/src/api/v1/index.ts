import express, { Router } from 'express';

import accountRouter from './routes/account';
import articleRouter from './routes/article';
import bullBoardRouter from './routes/bull-board';
import swaggerRouter from './routes/docs';
import metricRouter from './routes/metric';
import newsletterRourer from './routes/newsletter';
import policyRouter from './routes/policy';
import referralRouter from './routes/referral';
import sourceRouter from './routes/source';
import { DBService } from '../../services';

const router = Router();

async function main() {
  await DBService.init();
  router.use(express.static('public'));
  router.use('/account', accountRouter);
  router.use('/article', articleRouter);
  router.use('/bull-board', bullBoardRouter);
  router.use('/metrics', metricRouter);
  router.use('/newsletter', newsletterRourer);
  router.use('/policy', policyRouter);
  router.use('/referral', referralRouter);
  router.use('/source', sourceRouter);
  router.use('/docs', swaggerRouter);
  router.get('/healthz', (_, res) => res.send('OK'));
}

main();

export default router;
