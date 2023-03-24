import ms from 'ms';

import {
  Outlet,
  Queue,
  Summary,
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
    // Worker that processes site maps and generates new summaries
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
              await job.moveToFailed(`Outlet ${outletName} not found`);
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
              const existingSummary = await Summary.findOne({
                attributes: ['id'],
                where: { url },
              });
              if (existingSummary) {
                console.log(`Summary ${url} has already been processed. Use the force property to force a rewrite.`);
                await job.moveToCompleted();
                return existingSummary;
              }
            }
            fetchMap[outletData.name] = (fetchMap[outletData.name] ?? 0) + 1;
            const scribe = new ScribeService();
            const summary = await scribe.readAndSummarizeExternalArticle(
              { url },
              { outletId: outletData.id }
            );
            await job.moveToCompleted();
            return summary;
          } catch (e) {
            console.error(e);
            await job.moveToFailed(e);
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
