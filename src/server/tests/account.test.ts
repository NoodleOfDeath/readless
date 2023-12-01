import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { User } from '../src/api/v1/schema';
import { DBService } from '../src/services';

jest.setTimeout(120_000);

describe('tests the user instance methods', () => {
  
  test('streak', async () => {
    await DBService.prepare();
    const user = await User.from({ email: 'thommy.morgan@gmail.com' });
    if (!user) {
      throw new Error('User not found');
    }
    const streak = await user.calculateStreak();
    console.log(streak);
    expect(streak).toBeDefined();
    expect(streak.length).toBeGreaterThan(0);
    const longestStreak = await user.calculateLongestStreak();
    console.log(longestStreak);
    expect(longestStreak).toBeDefined();
    expect(longestStreak.length).toBe(4);
    expect(longestStreak.start.toISOString()).toBe(new Date('2023-11-17T05:00:00.000Z').toISOString());
    expect(longestStreak.end.toISOString()).toBe(new Date('2023-11-20T05:00:00.000Z').toISOString());
  });

  test('gen-usernames', async () => {
    await DBService.prepare();
    const users = await User.findAll();
    for (const user of users) {
      if (!(await user.findAlias('username'))) {
        await user.generateUsername();
      }
    }
  });

  test('metrics', async () => {
    await DBService.prepare();
    const metrics = await User.getMetrics();
    console.log(metrics);
    expect(metrics).toBeDefined();
  });

  test('stats', async () => {
    await DBService.prepare();
    const user = await User.from({ userId: 162 });
    if (!user) {
      throw new Error('User not found');
    }
    const stats = await user.getStats();
    console.log(stats);
    console.log(stats.achievements.map(a => a.achievement?.name));
    expect(stats).toBeDefined();
  });

});