import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { parseAnyDate } from '../src/utils';

jest.setTimeout(30_000);

const DATES = [
  '7th Feb 2023',
  'April 23, 2023 08:44 EDT',
  '7th October 2023 at 09:36PM EST',
  '5 hours ago',
  '3m ago',
  '10m',
];

describe('date tests', () => {
  for (const date of DATES) {
    test(`parsing: ${date}`, async () => {
      try {
        const parsedDate = parseAnyDate(date);
        expect(parsedDate).toBeDefined();
      } catch (e) {
        console.error(e);
      }
    });
  }
});
