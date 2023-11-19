import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { User } from '../src/api/v1/schema';
import { DBService } from '../src/services';

jest.setTimeout(30_000);

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
    const longestStreak = await user.calculateLongestStreak();
    console.log(longestStreak);
    expect(longestStreak).toBeDefined();
    expect(longestStreak.length).toBe(4);
    expect(longestStreak.start.toISOString()).toBe(new Date('2023-11-01T00:00:00.000Z').toISOString());
  });

});