import { CronJob } from 'cron';
import axios from 'axios';
import { parse } from 'node-html-parser';
import bottleneck from 'bottleneck';
import { BaseService } from '../base';
import { QueueService } from '../queue';
import { Outlet } from '../../api/v1/schema';
import { SourceController } from './../../api/v1/controllers';

export class AutomationService extends BaseService {
  static init() {
    // poll for new current events every 30 min
    const job = new CronJob('*/30 * * * *', () => AutomationService.pollForNews);
    job.start();
    AutomationService.pollForNews();
  }

  static async pollForNews() {
    console.log('fetching news!');
    try {
      const { rows: outlets } = await Outlet.findAndCountAll();
      const controller = new SourceController();
      console.log(controller);
      const queue = new QueueService();
      const limiter = new bottleneck({ maxConcurrent: 5 });
      limiter.on('idle', () => console.log('done fetching news!'));
      for (const outlet of outlets) {
        const { name, siteMaps } = outlet.toJSON();
        console.log(`fetching sitemaps for ${name}`);
        if (siteMaps.length === 0) continue;
        for (const siteMap of siteMaps) {
          const { data } = await axios.get(siteMap.url)
          const root = parse(data);
          const urls = root.querySelectorAll(siteMap.selector).map((e) => e.textContent)
          for (const url of urls) {
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
}
