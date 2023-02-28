import axios from 'axios';
import { CronJob } from 'cron';
import { parse } from 'node-html-parser';
import { DBService, QueueService } from '../services';
import { Outlet, Source } from '../api/v1/schema';

async function main() {
  await DBService.init();
  // poll for new current events every 30 min
  const job = new CronJob('*/30 * * * *', () => pollForNews());
  job.start();
  pollForNews();
}

async function pollForNews() {
  console.log('fetching news!');
  try {
    const { rows: outlets } = await Outlet.findAndCountAll();
    const queue = new QueueService();
    for (const outlet of outlets) {
      const { name, siteMaps } = outlet.toJSON();
      console.log(`fetching sitemaps for ${name}`);
      if (siteMaps.length === 0) continue;
      for (const siteMap of siteMaps) {
        const { data } = await axios.get(siteMap.url)
        const root = parse(data);
        const urls = root.querySelectorAll(siteMap.selector).map((e) => e.textContent)
        for (const url of urls) {
          const source = await Source.findOne({ where: { url }});
          if (source) {
            console.log(`Already processed url ${url}. Skipping `);
            continue;
          }
          await queue.dispatch('urls', url, url, {
            jobId: url,
            lifo: true,
          });
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

main();