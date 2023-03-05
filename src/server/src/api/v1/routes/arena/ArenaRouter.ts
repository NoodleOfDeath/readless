import Arena from 'bull-arena';
import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { Router } from 'express';

import { QUEUES } from './../../../../services';

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REDIS_CLIENT = new IORedis(process.env.REDIS_CONNECTION_STRING) as any;

const arenaConfig = Arena(
  {
    BullMQ: Queue,
    queues: Object.entries(QUEUES).map(([name]) => ({
      type: 'bullmq',
      hostId: 'worker',
      name,
      redis: REDIS_CLIENT,
    })),
  },
  {
    basePath: '/',
    disableListen: true,
  },
);

router.use(arenaConfig);

export default router;
