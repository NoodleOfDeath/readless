import { Router } from 'express';

import accountRouter from './routes/account';
import categoryRouter from './routes/category';
import localizationRouter from './routes/localize';
import metricsRouter from './routes/metrics';
import openapiRouter from './routes/openapi';
import publisherRouter from './routes/publisher';
import serviceRouter from './routes/service';
import sitemapRouter from './routes/sitemap';
import subscribeRouter from './routes/subscribe';
import summaryRouter from './routes/summary';

const router = Router();

router.use('/account', accountRouter);
router.use('/category', categoryRouter);
router.use('/localize', localizationRouter);
router.use('/metrics', metricsRouter);
router.use('/openapi', openapiRouter);
router.use('/publisher', publisherRouter);
router.use('/service', serviceRouter);
router.use('/sitemap', sitemapRouter);
router.use('/subscribe', subscribeRouter);
router.use('/summary', summaryRouter);

router.get('/healthz', (_, res) => res.send('OK'));

export default router;
