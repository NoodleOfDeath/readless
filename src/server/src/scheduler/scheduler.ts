import ms from 'ms';
import { Op } from 'sequelize';

import {
  Job,
  Publisher,
  Queue,
  Recap,
  Summary,
  Worker,
} from '../api/v1/schema';
import {
  DBService,
  PuppeteerError,
  PuppeteerService,
} from '../services';

const SPIDER_FETCH_INTERVAL = process.env.SPIDER_FETCH_INTERVAL || '5m';
const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

async function main() {
  await DBService.prepare();
  await Queue.prepare();
  await Publisher.prepare();
  cleanUpDeadWorkers();
  scheduleJobs();
  scheduleRecapJobs();
  translatePublishers();
  pollForNews();
}

export async function translatePublishers() {
  try {
    console.log('translating publishers');
    await Publisher.prepare({ translate: true });
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
  } finally {
    setTimeout(translatePublishers, ms('5m'));
  }
}

export async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: publishers } = await Publisher.findAndCountAll();
    const queue = await Queue.from(Queue.QUEUES.sitemaps);
    for (const publisher of publishers) {
      try {
        if (publisher.delayedUntil && publisher.delayedUntil > new Date()) {
          console.log(`skipping ${publisher.name} until ${new Date(publisher.fetchPolicy.delayedUntil).toISOString()}`);
          continue;
        }
        console.log(`fetching sitemaps for ${publisher.name}`);
        const fetchedUrls = (await PuppeteerService.crawl(publisher)).filter((url) => url.priority === 0 || url.priority > Date.now() - ms(OLD_NEWS_THRESHOLD));
        console.log(`fetched ${fetchedUrls.length} urls for ${publisher.name}`);
        const existingJobs = await Job.findAll({ 
          where: { 
            name: fetchedUrls.map((u) => u.url),
            queue: 'sitemaps',
          },
        });
        const existingSummaries = await Summary.scope('public').findAll({ where: { url: fetchedUrls.map((u) => u.url) } });
        const urls = fetchedUrls.filter((u) => !existingJobs.some((j) => j.name === u.url) && !existingSummaries.some((s) => s.url === u.url));
        console.log(`found ${urls.length} new urls for ${publisher.name}`);
        for (const url of urls) {
          await queue.add(
            url.url,
            { 
              imageUrls: JSON.stringify(url.imageUrls),
              publisher: publisher.name,
              url: url.url,
            },
            {
              group: publisher.name,
              priority: BigInt(url.priority),
            }
          );
        }
        // reset failures on success
        await publisher.reset();
      } catch (e) {
        if (e instanceof PuppeteerError) {
          console.log(`failed to fetch sitemaps for ${publisher.name}: ${e.message}`);
          await publisher.failAndDelay();
        }
        if (process.env.ERROR_REPORTING) {
          console.error(e);
        }
      }
    }
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
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
    await Job.destroy({ 
      where: { 
        queue: 'sitemaps', 
        [Op.or]: [ 
          { createdAt: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }, 
          { delayedUntil: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } },
        ], 
      },
    });
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
  } finally {
    setTimeout(cleanUpDeadWorkers, ms('2m'));
  }
}

async function scheduleJobs() {
  try {
    console.log('scheduling cache jobs');
    const cacheQueue = await Queue.from(Queue.QUEUES.caches);
    await cacheQueue.clear();
    await cacheQueue.add(
      'cache-getTopStories-en', 
      {
        depth: 3,
        endpoint: 'getTopStories',
        locale: 'en',
      },
      { group: 'caches' }
    );
    console.log('done scheduling cache jobs');
    console.log('queuing topic jobs');
    const topicQueue = await Queue.from(Queue.QUEUES.topics);
    await topicQueue.clear();
    await topicQueue.add(
      'topics-resolution', 
      { summary: 0 },
      { group: 'topics' }
    );
    console.log('done scheduling topic jobs');
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
  } finally {
    setTimeout(scheduleJobs, ms('30s'));
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
      {
        group: 'daily',
        schedule: new Date(new Date(new Date().toDateString()).valueOf() + ms(offset ?? '0m') + ms(duration)),
      }
    );
  }
}

async function scheduleRecapJobs() {
  try {
    console.log('scheduling recaps');
    await scheduleRecapJob();
    console.log('done scheduling recap jobs');
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
  } finally {
    setTimeout(scheduleRecapJobs, ms('5m'));
  }
}

main();
