import ms from 'ms';
import { Op } from 'sequelize';

import { SummaryController } from '../api/v1/controllers';
import {
  Job,
  Outlet,
  Queue,
  Recap,
  Worker,
} from '../api/v1/schema';
import { SUPPORTED_LOCALES } from '../core/locales';
import { DBService, PuppeteerService } from '../services';

const SPIDER_FETCH_INTERVAL = process.env.SPIDER_FETCH_INTERVAL || '5m';
const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

async function main() {
  await DBService.initTables();
  await Queue.initQueues();
  await Outlet.initOutlets();
  pollForNews();
  cleanUpDeadWorkers();
  cacheApiSummaries();
  scheduleRecapJobs();
}

export function generateDynamicUrl(
  url: string
) {
  return url.replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
    const offset = Number($2 ?? 0) + Number($3 ?? 0);
    switch ($1) {
    case 'YYYY':
      return new Date(Date.now() + offset * ms('1y'))
        .getFullYear()
        .toString();
    case 'M':
      return (((new Date().getMonth() + offset) % 12) + 1).toString();
    case 'MM':
      return (((new Date().getMonth() + offset) % 12) + 1)
        .toString()
        .padStart(2, '0');
    case 'MMMM':
      return new Date(`2050-${((new Date().getMonth() + offset) % 12) + 1}-01`).toLocaleString('default', { month: 'long' });
    case 'D':
      return new Date(Date.now() + offset * ms('1d')).getDate().toString();
    case 'DD':
      return new Date(Date.now() + offset * ms('1d'))
        .getDate()
        .toString()
        .padStart(2, '0');
    default:
      return $0;
    }
  });
}

export async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: outlets } = await Outlet.findAndCountAll();
    const queue = await Queue.from(Queue.QUEUES.siteMaps);
    for (const outlet of outlets) {
      try {
        console.log(`fetching sitemaps for ${outlet.name}`);
        const urls = await PuppeteerService.crawl(outlet);
        for (const url of urls) {
          await queue.add(
            url,
            { 
              outlet: outlet.name,
              url,
            },
            outlet.name
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
    await Job.destroy({ where: { queue: 'siteMaps', [Op.or]: [ { createdAt: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }, { delayedUntil: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }] } });
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(cleanUpDeadWorkers, ms('2m'));
  }
}

async function cacheLocale(locale: string, depth = 1) {
  for (let page = 0; page < depth; page++) {
    await SummaryController.getSummariesInternal({
      forceCache: true,
      locale,
      page,
    });
  }
}

async function cacheApiSummaries() {
  try {
    console.log('caching queries');
    console.log(SUPPORTED_LOCALES);
    await cacheLocale('en', 3);
    for (const locale of SUPPORTED_LOCALES) {
      if (/^en/.test(locale)) {
        continue;
      }
      await cacheLocale(locale);
    }
    console.log('done caching');
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(cacheApiSummaries, ms('30s'));
  }
}

async function scheduleRecapJob(offset?: string) {
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
      new Date(new Date(new Date().toDateString()).valueOf() + ms(offset ?? '0m') + ms(duration) - ms('4h'))
    );
  }
}

async function scheduleRecapJobs() {
  try {
    console.log('scheduling recaps');
    scheduleRecapJob();
    scheduleRecapJob('1d');
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(scheduleRecapJobs, ms('10m'));
  }
}

main();
