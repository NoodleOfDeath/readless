import {
  Publisher,
  Queue,
  RateLimit,
  Summary,
  Worker,
} from '../api/v1/schema/models';
import {
  DBService,
  PuppeteerError,
  ScribeService,
} from '../services';

export async function main() {
  await DBService.prepare();
  await Queue.prepare();
  await Publisher.prepare();
  ScribeService.prepare();
  doWork();
}

export async function doWork() {
  try {
  // Worker that processes site maps and generates new summaries
    await Worker.from(
      Queue.QUEUES.sitemaps,
      async (job, next) => {
        let fetchMax: RateLimit;
        try {
          const {
            imageUrls,
            publisher: publisherName, 
            content, 
            url, 
            force, //  -- legacy support
          } = job.data;
          const publisher = await Publisher.findOne({ where: { name: publisherName } });
          if (!publisher) {
            console.log(`Publisher ${publisherName} not found`);
            await job.moveToFailed(`Publisher ${publisherName} not found`);
            return;
          }
          if (publisher.delayedUntil && publisher.delayedUntil > new Date()) {
            console.log(`skipping ${publisher.name} until ${new Date(publisher.delayedUntil).toISOString()}`);
            await job.schedule(publisher.delayedUntil);
            return;
          }
          const limit = await publisher.getRateLimit();
          if (await limit.isSaturated()) {
            console.log(`Publisher ${publisher.name} has reached its limit of ${limit.limit} per ${limit.window}ms`);
            await job.delay(limit.window);
            return;
          }
          fetchMax = await publisher.getRateLimit('maxAttempt');
          if (await fetchMax.isSaturated()) {
            console.log(`Publisher ${publisher.name} has reached its maximum fetch limit of ${fetchMax.limit} per ${fetchMax.window}ms`);
            await job.delay(fetchMax.window);
            return;
          }
          if (!force) {
            const existingSummary = await Summary.findOne({
              attributes: ['id'],
              where: { url },
            });
            if (existingSummary) {
              console.log(`Summary ${url} has already been processed. Use the force property to force a rewrite.`);
              await job.moveToCompleted();
              return existingSummary;
            }
          }
          try {
            const summary = await ScribeService.readAndSummarize(
              {
                content,
                imageUrls: JSON.parse(imageUrls ?? '[]') as string[], 
                priority: job.priority,
                publisher, 
                url,
              }
            );
            await publisher.success();
            await limit.advance();
            await job.moveToCompleted();
            return summary;
          } catch (e) {
            if (e instanceof PuppeteerError) {
              if (e.status === 403) {
                console.log(`failed to fetch sitemaps for ${publisher.name}: ${e.message}`);
                await publisher.failAndDelay();
              }
            }
            throw e;
          }
        } catch (e) {
          console.error(e);
          await job.moveToFailed(e);
        } finally {
          await fetchMax?.advance();
          next();
        }
      }
    );
  } catch (e) {
    console.error(e);
    setTimeout(() => doWork, 3_000);
  }
}

main();
