import { 
  Queue, 
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService, ScribeService } from '../services';

export async function main() {
  await DBService.prepare();
  await Queue.prepare();
  await ScribeService.prepare();
  doWork();
}

async function cacheGetSummaries(locale: string, depth = 1) {
  for (let page = 0; page < depth; page++) {
    await Summary.getSummaries({
      forceCache: true,
      locale,
      page,
    });
  }
}

async function cacheTopStories(locale: string, interval = '1d') {
  await Summary.getTopStories({
    forceCache: true,
    interval,
    locale,
  });
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
          } else if (endpoint === 'getTopStories') {
            await cacheTopStories(locale);
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