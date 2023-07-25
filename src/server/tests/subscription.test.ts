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
    await Subscription.notify('daily-recap', 'email', {
      text: 'fuck',
      to: 'thommy.morgan@gmail.com',
    });
    expect(true).toBe(true);
  });

});