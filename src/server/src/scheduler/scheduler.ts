import ms from 'ms';
import { Op } from 'sequelize';

import {
  Job,
  Publisher,
  Queue,
  Recap,
  Worker,
} from '../api/v1/schema';
import { SUPPORTED_LOCALES } from '../core/locales';
import { DBService, PuppeteerService } from '../services';

const SPIDER_FETCH_INTERVAL = process.env.SPIDER_FETCH_INTERVAL || '5m';
const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

async function main() {
  await DBService.prepare();
  await Queue.prepare();
  await Publisher.prepare();
  cleanUpDeadWorkers();
  scheduleCacheJobs();
  scheduleRecapJobs();
  pollForNews();
}

export async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: publishers } = await Publisher.findAndCountAll();
    const queue = await Queue.from(Queue.QUEUES.sitemaps);
    for (const publisher of publishers) {
      try {
        console.log(`fetching sitemaps for ${publisher.name}`);
        const urls = await PuppeteerService.crawl(publisher);
        for (const url of urls) {
          await queue.add(
            url,
            { 
              publisher: publisher.name,
              url,
            },
            publisher.name
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(pollForNews, ms(SPIDER_FETCH_INTERVAL));
  }
}

const RETIRE_IF_NO_RESPONSE_IN_MS = ms('10m');

export async function cleanUpDeadWorkers() {
  try {
    // check up on dead workers
    const [_, rows] = await Worker.update({
      deletedAt: new Date(),
      state: 'retired',
    }, { 
      returning: true,
      where: { lastUpdateAt: { [Op.lt]: new Date(Date.now() - RETIRE_IF_NO_RESPONSE_IN_MS) } },
    });
    const deadWorkers = rows?.map((r) => r.id);
    if (deadWorkers) {
      await Job.update({
        lockedBy: null,
        startedAt: null,
      }, { where: { lockedBy: deadWorkers } });
    }
    // clean up stale sitemaps jobs
    await Job.destroy({ where: { queue: 'sitemaps', [Op.or]: [ { createdAt: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }, { delayedUntil: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }] } });
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(cleanUpDeadWorkers, ms('2m'));
  }
}

async function scheduleCacheJobs() {
  try {
    console.log('scheduling cache jobs');
    console.log(SUPPORTED_LOCALES);
    const queue = await Queue.from(Queue.QUEUES.caches);
    await queue.clear();
    await queue.add(
      'cache-getSummaries-en', 
      {
        depth: 3,
        endpoint: 'getSummaries',
        locale: 'en',
      },
      'caches'
    );
    await queue.add(
      'cache-getTopStories-en', 
      {
        endpoint: 'getTopStories',
        locale: 'en',
      },
      'caches'
    );
    for (const locale of SUPPORTED_LOCALES) {
      if (/^en/.test(locale)) {
        continue;
      }
      console.log('queuing', locale);
      await queue.add(
        `cache-getSummaries-${locale}`,
        {
          endpoint: 'getSummaries',
          locale,
        },
        'caches'
      );
      await queue.add(
        `cache-getTopStories-${locale}`,
        {
          endpoint: 'getTopStories',
          locale,
        },
        'caches'
      );
    }
    console.log('done scheduling cache jobs');
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(scheduleCacheJobs, ms('20s'));
  }
}

async function scheduleRecapJob(offset = '1d') {
  const queue = await Queue.from(Queue.QUEUES.recaps);
  const {
    key, start, end, duration, 
  } = Recap.key({ start: offset });
  if (!(await Recap.exists(key))) {
    await queue.add(
      key, 
      {
        duration,
        end,
        start,
      },
      'daily',
      new Date(new Date(new Date().toDateString()).valueOf() + ms(offset ?? '0m') + ms(duration))
    );
  }
}

async function scheduleRecapJobs() {
  try {
    console.log('scheduling recaps');
    await scheduleRecapJob();
    console.log('done scheduling recap jobs');
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(scheduleRecapJobs, ms('10m'));
  }
}

main();
