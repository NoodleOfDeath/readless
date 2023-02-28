import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

import { Source } from '../api/v1/schema';
import { SourceController } from '../api/v1/controllers';
import { QueueService } from '../services';

const queue = new QueueService();

const worker = new Worker(
  'urls',
  async (job: Job) => {
    const { data: url } = job;
    try {
      const existingSource = await Source.findOne({ where: { url } });
      if (existingSource) {
        console.log(`Source ${url} already processed. Skipping`);
        return;
      }
      const controller = new SourceController();
      const source = await controller.readAndSummarizeSource({ url });
      return source;
    } catch (e) {
      queue.dispatch('urls', url, url, {
        jobId: url,
      });
    }
  },
  {
    autorun: true,
    connection: new IORedis(process.env.REDIS_CONNECTION_STRING),
  },
);

console.log(worker);
