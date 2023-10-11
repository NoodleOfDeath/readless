import ms from 'ms';
import { Op } from 'sequelize';

import {
  Queue,
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService, OpenAIService } from '../services';

export async function main() {
  await DBService.prepare();
  await Queue.prepare();
  doWork();
}

const RELATIONSHIP_THRESHOLD = process.env.RELATIONSHIP_THRESHOLD ? Number(process.env.RELATIONSHIP_THRESHOLD) : 0.4;
const DUPLICATE_LOOKBACK_INTERVAL = process.env.DUPLICATE_LOOKBACK_INTERVAL || '1d';

export async function doWork() {
  try {
    // Worker that processes site maps and generates new summaries
    await Worker.from(
      Queue.QUEUES.topics,
      async (job, next) => {
        try {
          console.log('Resolving duplicates');
          const summaries = await Summary.findAll({ 
            order: [['originalDate', 'desc']],
            where: { originalDate: { [Op.gt]: new Date(Date.now() - ms(DUPLICATE_LOOKBACK_INTERVAL)) } },
          });
          for (const summary of summaries) {
            console.log('checking', summary.id);
            const siblings: Summary[] = [];
            const words = summary.title.replace(/[ \W]+/g, ' ').split(' ').map((w) => w);
            const existingSiblings = await summary.getSiblings();
            const filteredSummaries = summaries.filter((s) => s.id !== summary.id && !existingSiblings.includes(s.id));
            console.log('filters summaries', filteredSummaries.length);
            for (const possibleSibling of filteredSummaries) {
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
                const chatService = new OpenAIService();
                const yesOrNo = await chatService.send(`
                  Are the following articles about the same exact topic? Please respond only with YES or NO:
                  [Article 1] ${summary.title}: ${summary.shortSummary}
                  [Article 2] ${possibleSibling.title}: ${possibleSibling.shortSummary}
                `);
                if (/yes/i.test(yesOrNo)) {
                  siblings.push(possibleSibling);
                }
              }
            }
            console.log('linking for', summary.id);
            for (const sibling of siblings) {
              await summary.associateWith(sibling);
            }
          }
          console.log('done resolving duplicates');
          await job.moveToCompleted(true);
          return;
        } catch (e) {
          if (process.env.ERROR_REPORTING) {
            console.error(e);
          }
          await job.moveToFailed(e);
        } finally {
          next();
        }
      }
    );
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
    setTimeout(() => doWork, 3_000);
  }
}

main();
