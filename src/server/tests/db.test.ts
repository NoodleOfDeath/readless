import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { DBService } from '../src/services';

jest.setTimeout(30_000);

describe('db tests', () => {
  
  test('initializes views', async () => {
    await DBService.prepare({ initializeViews: true });
    expect(true).toBe(true);
  });

});