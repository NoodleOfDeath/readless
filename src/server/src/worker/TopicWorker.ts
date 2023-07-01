import ms from 'ms';
import { Op } from 'sequelize';

import {
  Queue,
  Summary,
  Worker,
} from '../api/v1/schema/models';
import { DBService, OpenAIService } from '../services';

export async function main() {
  await DBService.initTables();
  await Queue.initQueues();
  doWork();
}

const RELATIONSHIP_THRESHOLD = process.env.RELATIONSHIP_THRESHOLD ? Number(process.env.RELATIONSHIP_THRESHOLD) : 0.35; // Math.floor(8/16)
const DUPLICATE_LOOKBACK_INTERVAL = process.env.DUPLICATE_LOOKBACK_INTERVAL || '3d';

export async function doWork() {
  try {
    // Worker that processes site maps and generates new summaries
    await Worker.from(
      Queue.QUEUES.topics,
      async (job, next) => {
        try {
          const { summary: summaryId } = job.data;
          console.log(`Resolving duplicates for ${summaryId}`);
          const summary = await Summary.findByPk(summaryId);
          const summaries = await Summary.findAll({ where: { originalDate: { [Op.gt]: new Date(Date.now() - ms(DUPLICATE_LOOKBACK_INTERVAL)) } } });
          const siblings: Summary[] = [];
          const words = summary.title.replace(/[ \W]+/g, ' ').split(' ').map((w) => w);
          for (const possibleSibling of summaries) {
            if (summary.id === possibleSibling.id) {
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
              const chatService = new OpenAIService();
              const yesOrNo = await chatService.send(`
                Do the following article titles appear to be about the same topic? Please respond only with YES or NO:
                Article 1: ${summary.title}
                Article 2: ${possibleSibling.title}
              `);
              if (/yes/i.test(yesOrNo)) {
                siblings.push(possibleSibling);
              }
            }
            for (const sibling of siblings) {
              await summary.associateWith(sibling);
            }
          }
          await job.moveToCompleted();
          return;
        } catch (e) {
          console.error(e);
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
