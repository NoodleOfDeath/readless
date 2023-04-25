import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { parseDate } from '../src/utils';

jest.setTimeout(30_000);

type Test = {
  date: string;
  timezone?: string;
};

const DATES: Test[] = [
  { date: '7th Feb 2023' },
  { date: 'April 23, 2023 08:44 EDT' },
  { date: '7th October 2023 at 09:36PM EST' },
  { date: '5 hours ago' },
  { date: '3m ago' },
  { date: '10h ago' },
  { date: 'Apr 20, 2023, 11:19AM EDT' },
  { date: '20 April 2023 • 3:26pm' },
  { date: 'by Lauren Sforza - 04/24/23 6:03 PM ET' },
  { date: 'April 24, 2023 at 06:27 PM EDT' },
  { date: 'April 24, 2023 at 06:27 a.m. EDT' },
];

describe('date tests', () => {
  for (const date of DATES) {
    test(`parsing: ${date}`, async () => {
      try {
        const parsedDate = parseDate(date.date, date.timezone);
        console.log(parsedDate);
        expect(Number.isNaN(parsedDate.valueOf())).toBe(false);
      } catch (e) {
        console.error(e);
      }
    });
  }
});
