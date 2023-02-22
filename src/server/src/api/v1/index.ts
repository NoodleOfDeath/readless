import express, { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';

import { DBService } from '../../services';

import articlesRouter from './routes/articles';
import sourcesRouter from './routes/sources';
const router = Router();

async function main() {
  await DBService.init();
  
  router.use(express.static('public'));

  router.use('/articles', articlesRouter);
  router.use('/sources', sourcesRouter);

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
