import { CronJob } from 'cron';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import bottleneck from 'bottleneck';
import { BaseService } from '../base';
import { Outlet } from '../../api/v1/schema';
import { SourceController } from './../../api/v1/controllers';

export class AutomationService extends BaseService {
  static init() {
    // poll for new current events every 30 min
    const job = new CronJob('*/30 * * * *', () => AutomationService.pollForNews());
    job.start();
    AutomationService.pollForNews();
  }

  static async pollForNews() {
    console.log('fetching news!');
    try {
      const { rows: outlets } = await Outlet.findAndCountAll();
      const controller = new SourceController();
      console.log(controller);
      const limiter = new bottleneck({ maxConcurrent: 5 });
      limiter.on('idle', () => console.log('done fetching news!'));
      for (const outlet of outlets) {
        const { name, baseUrl, exprs } = outlet.toJSON();
        if (exprs.length === 0) continue;
        console.log(`fetching news from ${name}...`);
        const { data } = await axios.get(baseUrl);
        const { document } = new JSDOM(data, {
          contentType: 'text/xml',
        }).window;
        const urls = [...document.querySelectorAll('loc')].map((e) => e.textContent);
        urls.map((url) => limiter.schedule(() => controller.readAndSummarizeSource({ url })));
      }
    } catch (e) {
      console.error(e);
    }
  }
}
