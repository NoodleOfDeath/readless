import { Op } from 'sequelize';

import { Outlet, Source } from '../api/v1/schema/models';
import { ScribeService } from '../services';
import {
  DBService,
  QUEUES,
  Worker,
} from '../services';

/** Fetch rate per interval */
const WORKER_FETCH_RATE_LIMIT = process.env.WORKER_FETCH_RATE_LIMIT ? Number(process.env.WORKER_FETCH_RATE_LIMIT) : 1; // 1 for dev and testing
const WORKER_FETCH_INTERVAL_MS = process.env.WORKER_FETCH_INTERVAL_MS
  ? Number(process.env.WORKER_FETCH_INTERVAL_MS)
  : 1000 * 60 * 60 * 24; // 24 hours
const WORKER_CONCURRENCY = Math.min(
  process.env.WORKER_CONCURRENCY ? Number(process.env.WORKER_CONCURRENCY) : 3,
  WORKER_FETCH_RATE_LIMIT,
);

const fetchMap: Record<string, number> = {};

setInterval(() => {
  // reset fetch count every interval
  Object.keys(fetchMap).forEach((key) => {
    fetchMap[key] = 0;
  });
}, WORKER_FETCH_INTERVAL_MS);

export async function main() {
  await DBService.init();
  doWork();
}

export async function doWork() {
  try {
    // Worker that processes site maps and generates new sources
    const siteMapWorker = new Worker(
      QUEUES.siteMaps,
      async (job) => {
        try {
          const {
            id, name, url, force, 
          } = job.data;
          const outlet = (await Outlet.findOne({ where: { [Op.or]: [{ id }, { name }] } }))?.toJSON();
          if (!outlet) {
            console.log(`Outlet ${id} not found`);
            await job.moveToFailed(new Error(`Outlet ${id} not found`), siteMapWorker.queue.token, true);
            return;
          }
          const fetchCount = fetchMap[outlet.name] ?? 0;
          if (fetchCount >= WORKER_FETCH_RATE_LIMIT) {
            console.log(`Outlet ${outlet.name} has reached its fetch limit of ${WORKER_FETCH_RATE_LIMIT} per ${WORKER_FETCH_INTERVAL_MS}ms`);
            await siteMapWorker.queue.add(job.name, job.data, {
              jobId: job.id,
              delay: WORKER_FETCH_INTERVAL_MS,
            });
            return;
          }
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
          fetchMap[outlet.name] = fetchMap[outlet.name] + 1;
          const scribe = new ScribeService();
          const source = await scribe.readAndSummarizeSource(
            { url },
            {
              onProgress: (progress) => {
                job.updateProgress(progress);
              },
              outletId: id,
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
      },
    );
  } catch (e) {
    console.error(e);
    setTimeout(() => doWork, 3_000);
  }
}

main();
