import ms from 'ms';
import { Op } from 'sequelize';

import {
  Category,
  Job,
  Outlet,
  Queue,
  Summary,
  SummaryRelation,
  Worker,
} from '../api/v1/schema';
import { DBService, PuppeteerService } from '../services';

const SPIDER_FETCH_INTERVAL = process.env.SPIDER_FETCH_INTERVAL || '5m';
const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

async function main() {
  await DBService.initTables();
  await Category.initCategories();
  await Queue.initQueues();
  await Outlet.initOutlets();
  pollForNews();
  cleanUpDeadWorkers();
  bruteForceResolveDuplicates();
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
    await Job.destroy({ where: { queue: 'siteMaps', [Op.or]: [ { createdAt: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }, { delayedUntil: { [Op.lt]: new Date(Date.now() - ms(OLD_NEWS_THRESHOLD)) } }] } });
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(cleanUpDeadWorkers, ms('2m'));
  }
}

const RELATIONSHIP_THRESHOLD = 0.4;

export async function bruteForceResolveDuplicates() {
  try {
    const categories = await Category.findAll();
    for (const category of categories) {
      const summaries = await Summary.findAll({ where: { categoryId: category.id } });
      for (const summary of summaries) {
        const siblings: {
          summary: Summary;
          score: number;
        }[] = [];
        const words = summary.title.split(' ').map((w) => w);
        for (const possibleSibling of summaries) {
          if (summary.title === possibleSibling.title) {
            continue;
          }
          const siblingWords = possibleSibling.title.split(' ').map((w) => w);
          const score = words.map((a) => {
            if (siblingWords.some((b) => a === b && /[A-Z0-9]/.test(a))) {
              return 4;
            }
            if (siblingWords.some((b) => a === b)) {
              return 2;
            }
            if (siblingWords.some((b) => a.toLowerCase() === b.toLowerCase())) {
              return 1;
            }
            return 0;
          }).reduce((prev, curr) => curr + prev, 0) / (words.length * 4);
          if (score > RELATIONSHIP_THRESHOLD) {
            console.log('----------');
            console.log();
            console.log('Comparing');
            console.log(`>>> "${summary.title}"`);
            console.log('with');
            console.log(`>>> "${possibleSibling.title}"`);
            console.log('Score: ', score);
            console.log();
            siblings.push({
              score,
              summary: possibleSibling,
            });
          }
        }
        for (const sibling of siblings) {
          const relation = await SummaryRelation.findOne({
            where: {
              parentId: summary.id,
              siblingId: sibling.summary.id,
            },
          });
          if (relation) {
            continue;
          }
          await SummaryRelation.create({
            confidence: sibling.score,
            parentId: summary.id,
            siblingId: sibling.summary.id,
          });
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(bruteForceResolveDuplicates, ms('5m'));
  }
}

main();
