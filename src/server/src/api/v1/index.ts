import { Router } from 'express';
import { DBService } from '../../services';
import chatRouter from './routes/chat';
import newsRouter from './routes/news';
import scrapeRouter from './routes/scrape';

await DBService.init();

const router = Router();

router.use('/chat', chatRouter);
router.use('/news', newsRouter);
router.use('/scrape', scrapeRouter);

router.get('/healthz', (_, res) => res.send('OK'));

export default router;
