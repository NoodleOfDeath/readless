import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { DBService, ScribeService } from '../src/services';

jest.setTimeout(90_000);

describe('write a recap', () => {

  test('write a recap', async () => {
    try {
      await DBService.prepare();
      const recap = await ScribeService.writeRecap({
        duration: '1d',
        start: '2023-07-19',
      });
      expect(recap).toBeDefined();
      console.log(recap?.text);
    } catch (e) {
      console.log(e);
    }
  });

});
