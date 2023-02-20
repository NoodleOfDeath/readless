import { Router } from 'express';
import { DBService } from '../../services';
import chatRouter from './routes/chat';
import mineRouter from './routes/mine';
import newsRouter from './routes/news';

await DBService.init();

const router = Router();

router.get('/healthz', async (req, res) => {
  res.send('OK');
});

router.use('/chat', chatRouter);
router.use('/mine', mineRouter);
router.use('/news', newsRouter);

export default router;
