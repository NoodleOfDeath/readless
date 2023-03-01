import { Router } from 'express';
import Arena from 'bull-arena';
import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { QUEUES } from './../../../../services/';

const router = Router();

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
