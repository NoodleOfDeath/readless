import { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';

import { DBService } from '../../services';

import articlesRouter from './routes/articles';
import sourcesRouter from './routes/sources';
import scrapeRouter from './routes/scrape';

await DBService.init();

const router = Router();

router.use('/articles', articlesRouter);
router.use('/sources', sourcesRouter);
router.use('/scrape', scrapeRouter);

router.get('/healthz', (_, res) => res.send('OK'));

router.use(
  '/docs',
  SwaggerUi.serve,
  SwaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  }),
);

export default router;
