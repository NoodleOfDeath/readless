import axios from 'axios';
import { CronJob } from 'cron';
import { parse } from 'node-html-parser';
import { Op } from 'sequelize';
import { DBService, QUEUES, QueueService } from '../services';
import { Outlet, Source } from '../api/v1/schema';

async function main() {
  await DBService.init();
  // poll for new current events every 30 min
  const job = new CronJob('*/30 * * * *', () => pollForNews());
  job.start();
  pollForNews();
}

function generateDynamicUrl(url: string) {
  return url
    .replace('YYYY', new Date().getFullYear().toString())
    .replace('MMMM', new Date().toLocaleString('default', { month: 'long' }))
    .replace('MM', new Date().getMonth().toString())
    .replace('DD', new Date().getDate().toString());
}

async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: outlets } = await Outlet.findAndCountAll();
    const queue = new QueueService({
      defaultJobOptions: {
        lifo: true,
        removeOnComplete: {
          age: 360_000,
          count: 0,
        },
      },
    });
    for (const outlet of outlets) {
      const { id, name, siteMaps } = outlet.toJSON();
      console.log(`fetching sitemaps for ${name}`);
      if (siteMaps.length === 0) continue;
      for (const siteMap of siteMaps) {
        const url = generateDynamicUrl(siteMap.url);
        console.log(`fetching ${url} from outlet ${name}...`);
        const { data } = await axios.get(url);
        const root = parse(data);
        const urls = root
          .querySelectorAll(siteMap.selector)
          .map((e) =>
            siteMap.attribute && e.getAttribute(siteMap.attribute) ? e.getAttribute(siteMap.attribute) : e.textContent,
          );
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
  } catch (e) {
    console.error(e);
  }
}

main();
