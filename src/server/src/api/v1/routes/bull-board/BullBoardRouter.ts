import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import { Router } from 'express';

import { QUEUES, redisClient } from './../../../../services';

const router = Router();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/v1/bull-board');

createBullBoard({
  queues: Object.keys(QUEUES).map((queue) => {
    return new BullMQAdapter(new Queue(queue, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connection: redisClient() as any,
    }));
  }),
  serverAdapter: serverAdapter,
});

router.use(serverAdapter.getRouter());

export default router;
