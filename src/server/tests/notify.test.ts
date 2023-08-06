import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Subscription } from '../src/api/v1/schema';
import { DBService } from '../src/services';

jest.setTimeout(90_000);

describe('push notification tests', () => {

  test('push', async () => {
    try {
      await DBService.prepare();
      await Subscription.notify('default', 'push', {
        body: 'this is a test!',
        title: 'test!',
      });
      expect(true).toBe(true);
    } catch (e) {
      console.log(e);
    }
  });

});
