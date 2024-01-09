import * as use from '@tensorflow-models/universal-sentence-encoder';
import ms from 'ms';
import { Op } from 'sequelize';

import { Summary, SystemLog } from '../api/v1/schema/models';
import { compareSimilarity } from '../core/server';
import { DBService } from '../services';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let model: any;

export async function main() {
  await DBService.prepare();
  model = await use.load();
  doWork();
}

const RELATIONSHIP_THRESHOLD = process.env.RELATIONSHIP_THRESHOLD ? Number(process.env.RELATIONSHIP_THRESHOLD) : 0.75;
const DUPLICATE_LOOKBACK_INTERVAL = process.env.DUPLICATE_LOOKBACK_INTERVAL || '1d';
const TOPIC_RECALCULATE_RATE = ms(process.env.TOPIC_RECALCULATE_RATE || '5m');

export async function doWork() {
  try {
    console.log('Resolving duplicates');
    const summaries = await Summary.findAll({ 
      order: [['originalDate', 'desc']],
      where: { originalDate: { [Op.gte]: new Date(Date.now() - ms(DUPLICATE_LOOKBACK_INTERVAL)) } },
    });
    console.log('found summaries', summaries.length);
    const topSummaries = await Promise.all((await Summary.getTopStories()).rows.map(async (s) => await Summary.findByPk(s.id)));
    console.log('found top summaries', topSummaries.length);
    for (const summary of [...summaries, ...topSummaries]) {
      try {
        console.log('finding siblings for', summary.id);
        const siblings: Summary[] = [];
        for (const possibleSibling of summaries) {
          try {
            if (!(await summary.isRelatedTo(possibleSibling))) {
              const score = await compareSimilarity(summary.shortSummary, possibleSibling.shortSummary, model);
              if (score >= RELATIONSHIP_THRESHOLD) {
                siblings.push(possibleSibling);
              } 
            }
          } catch (e) {
            if (process.env.ERROR_REPORTING) {
              console.error(e);
            }
            await SystemLog.create({
              level: 'error',
              message: `${e}`,
            });
          }
        }
        console.log('making associations for', summary.id);
        for (const sibling of siblings) {
          await summary.associateWith(sibling);
        }
      } catch (e) {
        if (process.env.ERROR_REPORTING) {
          console.error(e);
        }
        await SystemLog.create({
          level: 'error',
          message: `${e}`,
        });
      }
    }
    console.log('done resolving duplicates');
  } catch (e) {
    if (process.env.ERROR_REPORTING) {
      console.error(e);
    }
    await SystemLog.create({
      level: 'error',
      message: `${e}`,
    });
  } finally {
    setTimeout(doWork, TOPIC_RECALCULATE_RATE);
  }
}

main();
