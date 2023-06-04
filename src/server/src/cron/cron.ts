import ms from 'ms';
import { Op } from 'sequelize';

import {
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
  await Queue.initQueues();
  await Outlet.initOutlets();
  bruteForceResolveDuplicates();
  pollForNews();
  cleanUpDeadWorkers();
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

const RELATIONSHIP_THRESHOLD = process.env.RELATIONSHIP_THRESHOLD ? Number(process.env.RELATIONSHIP_THRESHOLD) : 0.45; // Math.floor(8/16)
const DUPLICATE_LOOKBACK_INTERVAL = process.env.DUPLICATE_LOOKBACK_INTERVAL || '24h';

export async function bruteForceResolveDuplicates() {
  try {
    console.log('Resolving duplicates...');
    const summaries = await Summary.findAll({ where: { originalDate: { [Op.gt]: new Date(Date.now() - ms(DUPLICATE_LOOKBACK_INTERVAL)) } } });
    for (const summary of summaries) {
      const siblings: {
        summary: Summary;
        score: number;
      }[] = [];
      const words = summary.title.replace(/[ \W]+/g, ' ').split(' ').map((w) => w);
      for (const possibleSibling of summaries) {
        if (summary.title === possibleSibling.title) {
          continue;
        }
        const relation = await SummaryRelation.findOne({
          where: {
            parentId: summary.id,
            siblingId: possibleSibling.id,
          },
        });
        if (relation) {
          continue;
        }
        const siblingWords = possibleSibling.title.replace(/[ \W]+/g, ' ').split(' ').map((w) => w);
        const score = words.map((a) => {
          if (siblingWords.some((b) => a.toLowerCase() === b.toLowerCase())) {
            return 4;
          }
          if (siblingWords.some((b) => a.replace(/\W/g, '').length > 0 && new RegExp(`${a.replace(/\W/g, '')}(?:ies|es|s|ed|ing)?`, 'i').test(b))) {
            return 2;
          }
          return 0;
        }).reduce((prev, curr) => curr + prev, 0) / (words.length * 4) + (summary.categoryId === possibleSibling.categoryId ? 0.05 : 0.0);
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
  } catch (e) {
    console.error(e);
  } finally {
    console.log('----------');
    console.log();
    console.log('>>> done resolving duplicates');
    setTimeout(bruteForceResolveDuplicates, ms('5m'));
  }
}

main();
