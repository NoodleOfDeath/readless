import ms from 'ms';
import { Op } from 'sequelize';

import {
  Queue,
  Subscription,
  Worker,
} from '../api/v1/schema/models';
import {
  DBService,
  FirebaseMessage,
  FirebaseService,
  ScribeService,
} from '../services';

export async function main() {
  await DBService.prepare();
  await Queue.prepare();
  ScribeService.prepare();
  doWork();
  sendDailyPushNotifications();
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
  } finally {
    setTimeout(() => doWork(), 3_000);
  }
}

export async function sendDailyPushNotifications() {
  try {
    // Worker that processes site maps and generates new summaries
    const subscriptions = await Subscription.findAll({
      where: {
        channel: ['push', 'fcm', 'apns'],
        event: 'daily-reminder',
        fireTime: { [Op.lte]: new Date() },
      },
    });
    if (!subscriptions.length) {
      throw new Error('no subscriptions');
    }
    console.log(`notifying ${subscriptions.length} subscribers`);
    const messages: FirebaseMessage[] = [];
    for (const sub of subscriptions) {
      const title = sub.title || 'Daily Reminder';
      const body = sub.body || 'This is your daily reminder to read the news and learn something new!';
      messages.push({ notification: { body, title }, token: sub.uuid });
      if (sub.repeats) {
        sub.set('fireTime', new Date(sub.fireTime.valueOf() + ms(sub.repeats)));
        await sub.save();
      } else {
        await sub.destroy();
      }
    }
    await FirebaseService.notify(messages);
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(() => sendDailyPushNotifications(), 3_000);
  }
}

main();
