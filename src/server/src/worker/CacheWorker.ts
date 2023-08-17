import { 
  Publisher,
  Queue, 
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService } from '../services';

export async function main() {
  await DBService.prepare();
  await Queue.prepare();
  await Publisher.prepare({ translate: true });
  doWork();
}

async function cacheGetSummaries(locale: string, depth = 1) {
  let offset = 0;
  for (let page = 0; page < depth; page++) {
    const { next } = await Summary.getSummaries({
      forceCache: true,
      locale,
      offset,
    });
    offset = next;
  }
}

async function cacheTopStories(locale: string, interval = '1d', depth = 1) {
  let offset = 0;
  for (let page = 0; page < depth; page++) {
    const { next } = await Summary.getTopStories({
      cacheHalflife: '3m',
      forceCache: true,
      interval,
      locale,
      offset,
    });
    offset = next;
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
            endpoint, locale, interval, depth, 
          } = job.data;
          console.log('caching queries', locale, depth);
          if (endpoint === 'getSummaries') {
            await cacheGetSummaries(locale, depth);
          } else if (endpoint === 'getTopStories') {
            await cacheTopStories(locale, interval, depth);
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