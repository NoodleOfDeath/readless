import { Source } from '../api/v1/schema';
import { SourceController } from '../api/v1/controllers';
import { DBService, QUEUES, Worker } from '../services';

/** Fetch rate per hour */
const FETCH_RATE_LIMIT = process.env.FETCH_RATE_LIMIT ? Number(process.env.FETCH_RATE_LIMIT) : 2;
const FETCH_INTERVAL_MS = process.env.FETCH_INTERVAL_MS ? Number(process.env.FETCH_INTERVAL_MS) : 1000 * 60 * 30; // 30 min
const WORKER_CONCURRENCY = process.env.WORKER_CONCURRENCY ? Number(process.env.WORKER_CONCURRENCY) : 5;

export async function main() {
  await DBService.init();
  let fetchesInLastInterval = 0;
  let fetchMap: { [key: string]: number } = {};
  // Reset fetch count in the last interval
  setInterval(() => {
    fetchesInLastInterval = 0;
    fetchMap = {};
  }, FETCH_INTERVAL_MS);
  async function doWork() {
    try {
      // Worker that processes site maps and generates new sources
      const siteMapWorker = new Worker(
        QUEUES.siteMaps,
        async (job) => {
          try {
            if (fetchesInLastInterval >= FETCH_RATE_LIMIT) {
              console.log(`Rate limit reached. Delaying ${job.name}`);
              siteMapWorker.queue.add(job.name, job.data, { delay: FETCH_INTERVAL_MS });
              return;
            }
            const { name, url } = job.data;
            const existingSource = await Source.findOne({
              attributes: ['id'],
              where: { url },
            });
            if (existingSource) {
              console.log(`Source ${url} already processed. Skipping`);
              return existingSource;
            }
            fetchMap[name] = (fetchMap[name] ?? 0) + 1;
            const controller = new SourceController();
            const source = await controller.readAndSummarizeSource({ url }, (progress) => {
              job.updateProgress(progress);
            });
            fetchesInLastInterval++;
            return source;
          } catch (e) {
            console.error(e);
            await job.moveToFailed(e, siteMapWorker.queue.token, true);
          }
        },
        {
          autorun: true,
          concurrency: WORKER_CONCURRENCY,
        },
      );
    } catch (e) {
      console.error(e);
      setTimeout(() => doWork, 3_000);
    }
  }
  doWork();
}

main();
