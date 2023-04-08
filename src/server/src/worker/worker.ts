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
            outlet: outletName, url, force, 
          } = job.data;
          const outlet = await Outlet.findOne({ where: { name: outletName } });
          if (!outlet) {
            console.log(`Outlet ${outletName} not found`);
            await job.moveToFailed(`Outlet ${outletName} not found`);
            return;
          }
          const limit = await outlet.getRateLimit();
          if (await limit.isSaturated()) {
            console.log(`Outlet ${outlet.name} has reached its fetch limit of ${limit.limit} per ${limit.window}ms`);
            await job.delay(limit.window);
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
          limit.advance();
          const summary = await ScribeService.readAndSummarize(
            { url },
            { outletId: outlet.id }
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
  } catch (e) {
    console.error(e);
    setTimeout(() => doWork, 3_000);
  }
}

main();
