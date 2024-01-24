import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Subscription } from '../src/api/v1/schema';
import { DBService } from '../src/services';

jest.setTimeout(30_000);

describe('tests subscriptions', () => {
  
  test('subscription', async () => {
    await DBService.prepare();
    await Subscription.notify('streak-reminder', 'push', {
      body: 'Come check the news and keep your epic streak!',
      title: 'Keep Up Your Streak!',
      userId: [435, 525],
    });
    expect(true).toBe(true);
  });

});