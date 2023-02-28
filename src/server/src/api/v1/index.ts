import express, { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';

import { DBService } from '../../services';

import ArenaRouter from './routes/arena';
import ArticleRouter from './routes/articles';
import PolicyRouter from './routes/policies';
import SourceRouter from './routes/sources';
import ReferralRouter from './routes/referrals';

const router = Router();

async function main() {
  await DBService.init();

  router.use(express.static('public'));

  router.use('/arena', ArenaRouter);
  router.use('/articles', ArticleRouter);
  router.use('/policies', PolicyRouter);
  router.use('/sources', SourceRouter);
  router.use('/referrals', ReferralRouter);

  router.get('/healthz', (_, res) => res.send('OK'));

  router.use(
    '/docs',
    SwaggerUi.serve,
    SwaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/v1/swagger.json',
      },
    }),
  );
}

main();

export default router;
