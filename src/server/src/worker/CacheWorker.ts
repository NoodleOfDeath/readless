import { 
  Queue, 
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService, ScribeService } from '../services';

export async function main() {
  await DBService.initTables();
  await Queue.initQueues();
  await ScribeService.init();
  doWork();
}

async function cacheGetSummaries(locale: string, depth = 1) {
  for (let page = 0; page < depth; page++) {
    await Summary.searchSummaries({
      forceCache: true,
      locale,
      page,
    });
  }
}

export async function doWork() {
  try {
    // Worker that processes site maps and generates new summaries
    await Worker.from(
      Queue.QUEUES.caches,
      async (job, next) => {
        try {
          const {
            endpoint, locale, depth, 
          } = job.data;
          console.log('caching queries', locale, depth);
          if (endpoint === 'getSummaries') {
            await cacheGetSummaries(locale, depth);
          }
          console.log('done caching');
          await job.moveToCompleted(true);
        } catch (e) {
          console.error(e);
          await job.moveToFailed(e);
        } finally {
          next();
        }
      },
      { fifo: true }
    );
  } catch (e) {
    console.error(e);
    doWork();
  }
}

main();