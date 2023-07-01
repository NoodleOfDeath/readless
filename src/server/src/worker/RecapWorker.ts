import { Queue, Worker } from '../api/v1/schema/models';
import { DBService, ScribeService } from '../services';

export async function main() {
  await DBService.initTables();
  await Queue.initQueues();
  await ScribeService.init();
  doWork();
}

export async function doWork() {
  try {
    // Worker that processes site maps and generates new summaries
    await Worker.from(
      Queue.QUEUES.recaps,
      async (job, next) => {
        try {
          const recap = await ScribeService.writeRecap(job.data);
          await job.moveToCompleted();
          return recap;
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
