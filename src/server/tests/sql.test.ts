import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Category } from '../src/api/v1/schema';

jest.setTimeout(30_000);

describe('loads sql query', () => {
  
  test('load sql query', async () => {
    const query = Category.loadQuery('');
    console.log(query);
    expect(query).toBeDefined();
  });

});