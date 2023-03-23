import ms from 'ms';

import {
  Outlet,
  Queue,
  Source,
} from '../api/v1/schema/models';
import {
  DBService,
  ScribeService,
  Worker,
} from '../services';

/** Fetch rate per interval */
const WORKER_FETCH_RATE_LIMIT = process.env.WORKER_FETCH_RATE_LIMIT ? Number(process.env.WORKER_FETCH_RATE_LIMIT) : 1; // 1 for dev and testing
const WORKER_FETCH_INTERVAL_MS = process.env.WORKER_FETCH_INTERVAL_MS
  ? Number(process.env.WORKER_FETCH_INTERVAL_MS)
  : ms('1d');
const WORKER_CONCURRENCY = Math.min(
  process.env.WORKER_CONCURRENCY ? Number(process.env.WORKER_CONCURRENCY) : 2,
  WORKER_FETCH_RATE_LIMIT
);

const fetchMap: Record<string, number> = {};

setInterval(() => {
  // reset fetch count every interval
  Object.keys(fetchMap).forEach((key) => {
    fetchMap[key] = 0;
  });
}, WORKER_FETCH_INTERVAL_MS);

export async function main() {
  await DBService.initTables();
  doWork();
}

export async function doWork() {
  try {
    // Worker that processes site maps and generates new sources
    for (let n = 0; n < WORKER_CONCURRENCY; n++) {
      await Worker.from(
        Queue.QUEUES.siteMaps,
        async (job, next) => {
          try {
            const {
              outlet: outletName, url, force, 
            } = job.toJSON().data;
            const outlet = await Outlet.findOne({ where: { name: outletName } });
            if (!outlet) {
              console.log(`Outlet ${outletName} not found`);
              await job.moveToFailed();
              return;
            }
            const outletData = outlet.toJSON();
            const fetchCount = fetchMap[outletData.name] ?? 0;
            if (fetchCount >= WORKER_FETCH_RATE_LIMIT) {
              console.log(`Outlet ${outletData.name} has reached its fetch limit of ${WORKER_FETCH_RATE_LIMIT} per ${WORKER_FETCH_INTERVAL_MS}ms`);
              await job.delay(WORKER_FETCH_INTERVAL_MS);
              return;
            }
            if (!force) {
              const existingSource = await Source.findOne({
                attributes: ['id'],
                where: { url },
              });
              if (existingSource) {
                console.log(`Source ${url} has already been processed. Use the force property to force a rewrite.`);
                await job.moveToCompleted();
                return existingSource;
              }
            }
            fetchMap[outlet.name] = fetchMap[outlet.name] + 1;
            const scribe = new ScribeService();
            const source = await scribe.readAndSummarizeSource(
              { url },
              { outletId: outletData.id }
            );
            await job.moveToCompleted();
            return source;
          } catch (e) {
            console.error(e);
            await job.moveToFailed();
          } finally {
            next();
          }
        }
      );
    }
  } catch (e) {
    console.error(e);
    setTimeout(() => doWork, 3_000);
  }
}

main();
