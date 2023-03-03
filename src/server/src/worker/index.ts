import { Source } from '../api/v1/schema';
import { SourceController } from '../api/v1/controllers';
import { DBService, QUEUES, Worker } from '../services';

/** Fetch rate per hour */
const WORKER_FETCH_RATE_LIMIT = process.env.WORKER_FETCH_RATE_LIMIT ? Number(process.env.WORKER_FETCH_RATE_LIMIT) : 2; // 2 for dev and testing
const WORKER_FETCH_INTERVAL_MS = process.env.WORKER_FETCH_INTERVAL_MS
  ? Number(process.env.WORKER_FETCH_INTERVAL_MS)
  : 1000 * 60 * 60 * 24; // 24 hours
const WORKER_CONCURRENCY = Math.min(
  process.env.WORKER_CONCURRENCY ? Number(process.env.WORKER_CONCURRENCY) : 5,
  WORKER_FETCH_RATE_LIMIT,
);

export async function main() {
  await DBService.init();
  // Reset fetch count in the last interval
  async function doWork() {
    try {
      // Worker that processes site maps and generates new sources
      const siteMapWorker = new Worker(
        QUEUES.siteMaps,
        async (job) => {
          try {
            const { url, force } = job.data;
            if (!force) {
              const existingSource = await Source.findOne({
                attributes: ['id'],
                where: { url },
              });
              if (existingSource) {
                console.log(`Source ${url} has already been processed. Use the force property to force a rewrite.`);
                return existingSource;
              }
            }
            const controller = new SourceController();
            const source = await controller.readAndSummarizeSource(
              { url },
              {
                onProgress: (progress) => {
                  job.updateProgress(progress);
                },
              },
            );
            return source;
          } catch (e) {
            console.error(e);
            await job.moveToFailed(e, siteMapWorker.queue.token, true);
          }
        },
        {
          autorun: true,
          concurrency: WORKER_CONCURRENCY,
          limiter: {
            max: WORKER_FETCH_RATE_LIMIT,
            duration: WORKER_FETCH_INTERVAL_MS,
          },
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
