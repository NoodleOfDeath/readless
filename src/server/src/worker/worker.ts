import {
  Outlet,
  Queue,
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService, ScribeService } from '../services';

export async function main() {
  await DBService.initTables();
  await Queue.initQueues();
  await Outlet.initOutlets();
  await ScribeService.init();
  doWork();
}

export async function doWork() {
  try {
  // Worker that processes site maps and generates new summaries
    await Worker.from(
      Queue.QUEUES.siteMaps,
      async (job, next) => {
        try {
          const {
            outlet: outletName, content, url, force, 
          } = job.data;
          const outlet = await Outlet.findOne({ where: { name: outletName } });
          if (!outlet) {
            console.log(`Outlet ${outletName} not found`);
            await job.moveToFailed(`Outlet ${outletName} not found`);
            return;
          }
          const limit = await outlet.getRateLimit();
          if (await limit.isSaturated()) {
            console.log(`Outlet ${outlet.name} has reached its limit of ${limit.limit} per ${limit.window}ms`);
            await job.delay(limit.window);
            return;
          }
          const fetchMax = await outlet.getRateLimit('fetch-max');
          if (await fetchMax.isSaturated()) {
            console.log(`Outlet ${outlet.name} has reached its maximum fetch limit of ${fetchMax.limit} per ${fetchMax.window}ms`);
            await job.delay(fetchMax.window);
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
          fetchMax.advance();
          const summary = await ScribeService.readAndSummarize(
            {
              content, 
              dateAttribute: outlet.siteMaps.map((s) => s.dateAttribute).filter(Boolean).join(','),
              dateSelector: outlet.siteMaps.map((s) => s.dateSelector).filter(Boolean).join(','),
              outletId: outlet.id, 
              timezone: outlet.timezone,
              url, 
            }
          );
          limit.advance();
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
  } catch (e) {
    console.error(e);
    setTimeout(() => doWork, 3_000);
  }
}

main();
