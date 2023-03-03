import axios from 'axios';
import { CronJob } from 'cron';
import { parse } from 'node-html-parser';
import { Op } from 'sequelize';
import { DBService, QUEUES, QueueService } from '../services';
import { Outlet, SiteMapParams, Source } from '../api/v1/schema';

async function main() {
  await DBService.init();
  // poll for new current events every 30 min
  const job = new CronJob('*/30 * * * *', () => pollForNews());
  job.start();
  pollForNews();
}

const DAY = 1000 * 60 * 60 * 24;
const YEAR = DAY * 365;

function generateDynamicUrls(url: string, params?: SiteMapParams, index = -1): string[] {
  const urls: string[] = [];
  if (Array.isArray(params)) {
    urls.push(...params.map((arr, i) => arr.map((p) => generateDynamicUrls(url, p, i))).flat(2));
  } else {
    urls.push(
      url.replace(/\$\{(.*?)(?:(-?\d\d?)|\+(\d\d?))?\}/g, ($0, $1, $2, $3) => {
        const offset = Number($2 ?? 0) + Number($3 ?? 0);
        switch ($1) {
          case 'YYYY':
            return new Date(Date.now() + offset * YEAR).getFullYear().toString();
          case 'M':
            return (((new Date().getMonth() + offset) % 12) + 1).toString();
          case 'MM':
            return (((new Date().getMonth() + offset) % 12) + 1).toString().padStart(2, '0');
          case 'MMMM':
            return new Date(`2050-${((new Date().getMonth() + offset) % 12) + 1}-01`).toLocaleString('default', {
              month: 'long',
            });
          case 'D':
            return new Date(Date.now() + offset * DAY).getDate().toString();
          case 'DD':
            return new Date(Date.now() + offset * DAY).getDate().toString().padStart(2, '0');
          default:
            if (params && !Number.isNaN(Number($1))) {
              const i = Number($1);
              if (i === index + 1) return params;
            }
            return $0;
        }
      }),
    );
  }
  return urls;
}

async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: outlets } = await Outlet.findAndCountAll();
    const queue = new QueueService({
      defaultJobOptions: {
        lifo: true,
      },
    });
    for (const outlet of outlets) {
      const { id, name, siteMaps } = outlet.toJSON();
      console.log(`fetching sitemaps for ${name}`);
      if (siteMaps.length === 0) continue;
      for (const siteMap of siteMaps) {
        const { selector, attribute, params } = siteMap;
        const queryUrls = generateDynamicUrls(siteMap.url, params);
        for (const queryUrl of queryUrls) {
          console.log(`fetching ${queryUrls} from outlet ${name}...`);
          const { data } = await axios.get(queryUrl);
          const root = parse(data);
          const urls = root.querySelectorAll(selector).map((e) => {
            const href = (attribute && e.getAttribute(attribute) ? e.getAttribute(attribute) : e.textContent).trim();
            return /^https?:\/\//i.test(href) ? href : `${new URL(queryUrl).origin}/${href.replace(/^\//, '')}`;
          });
          const existingSources = await Source.findAll({
            where: {
              url: {
                [Op.in]: urls,
              },
            },
          });
          const filteredUrls = urls.filter((url) => !existingSources.some((source) => source.url === url));
          for (const url of filteredUrls) {
            await queue.dispatch(
              QUEUES.siteMaps,
              url,
              {
                id,
                name,
                url,
              },
              {
                jobId: url,
              },
            );
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

main();
