import ms from 'ms';
import { Op } from 'sequelize';

import {
  Queue,
  Subscription,
  User,
  Worker,
} from '../api/v1/schema/models';
import {
  DBService,
  FirebaseMessage,
  FirebaseService,
  ScribeService,
} from '../services';

async function main() {
  await DBService.prepare();
  await Queue.prepare();
  ScribeService.prepare();
  doWork();
  sendDailyPushNotifications();
  sendStreakPushNotifications();
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
    setTimeout(() => doWork(), 3_000);
  }
}

async function sendDailyPushNotifications() {
  try {
    console.log('sending daily push notifications!');
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

async function sendStreakPushNotifications() {
  try {
    console.log('sending streak push notifications!');
    // Worker that processes site maps and generates new summaries
    const subscriptions = await Subscription.findAll({
      where: {
        channel: ['push', 'fcm', 'apns'],
        event: 'streak-reminder',
        fireTime: { [Op.lte]: new Date() },
        userId: { [Op.ne]: null },
      },
    });
    if (!subscriptions.length) {
      throw new Error('no subscriptions');
    }
    const ids: Subscription[] = [];
    for (const sub of subscriptions) {
      const user = await User.findByPk(sub.userId);
      if (!user) {
        continue;
      }
      const streak = await user.calculateStreak();
      if (!streak) {
        continue;
      }
      if (streak.expiresSoon) {
        ids.push(sub);
      }
    }
    console.log(`notifying ${ids.length} subscribers`);
    const messages: FirebaseMessage[] = [];
    for (const sub of subscriptions) {
      const title = sub.title || 'Streak Reminder';
      const body = sub.body || 'Your streak is about to expire!';
      messages.push({ notification: { body, title }, token: sub.uuid });
    }
    await FirebaseService.notify(messages);
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(() => sendStreakPushNotifications(), 3_000);
  }
}

main();
