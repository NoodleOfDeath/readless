import {
  Publisher,
  Queue,
  RateLimit,
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService, ScribeService } from '../services';

export async function main() {
  await DBService.prepare();
  await Queue.prepare();
  Publisher.prepare();
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
            outlet, publisher: publisherName = outlet, content, url, force, //  -- legacy support
          } = job.data;
          const publisher = await Publisher.findOne({ where: { name: publisherName } });
          if (!publisher) {
            console.log(`Publisher ${publisherName} not found`);
            await job.moveToFailed(`Publisher ${publisherName} not found`);
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
          const summary = await ScribeService.readAndSummarize(
            {
              content, 
              publisher,
              url, 
            }
          );
          const topicQueue = await Queue.from(Queue.QUEUES.topics);
          await topicQueue.clear();
          await topicQueue.add(
            `topic-resolution-${summary.id}`,
            { summary: summary.id },
            'topics'
          );
          await fetchMax.advance();
          await limit.advance();
          await job.moveToCompleted();
          return summary;
        } catch (e) {
          console.error(e);
          await fetchMax.advance();
          await job.moveToFailed(e);
        } finally {
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
