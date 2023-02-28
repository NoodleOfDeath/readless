import express, { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';

import { DBService } from '../../services';

import articlesRouter from './routes/articles';
import sourcesRouter from './routes/sources';
import referralsRouter from './routes/referrals';

import { AutomationService } from '../../services';

const router = Router();

async function main() {
  await DBService.init();
  AutomationService.init();

  router.use(express.static('public'));

  router.use('/articles', articlesRouter);
  router.use('/sources', sourcesRouter);
  router.use('/referrals', referralsRouter);

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
