import express, { Router } from 'express';

import { DBService } from '../../services';

import arenaRouter from './routes/arena';
import articleRouter from './routes/articles';
import policyRouter from './routes/policies';
import sourceRouter from './routes/sources';
import referralRouter from './routes/referrals';

const router = Router();

async function main() {
  await DBService.init();
  router.use(express.static('public'));
  router.use('/arena', arenaRouter);
  router.use('/articles', articleRouter);
  router.use('/policies', policyRouter);
  router.use('/sources', sourceRouter);
  router.use('/referrals', referralRouter);
  router.get('/healthz', (_, res) => res.send('OK'));
}

main();

export default router;
