import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import ms from 'ms';

import { parseDate } from '../src/utils';

jest.setTimeout(30_000);

type Test = {
  date: string;
  expect: Date;
};

const DATES: Test[] = [
  {
    date: '7th Feb 2023', 
    expect: new Date('Feb 7, 2023'), 
  },
  {
    date: 'April 23, 2023 08:44 EDT',
    expect: new Date('Apr 23, 2023 08:44 EDT'), 
  },
  {
    date: '7th October 2023 at 09:36PM EST', 
    expect: new Date('Oct  7,2023 09:36 PM EST'), 
  },
  {
    date: '5 hours ago', 
    expect: new Date(Date.now() - ms('5h')), 
  },
  {
    date: '3m ago',
    expect: new Date(Date.now() - ms('3m')),
  },
  {
    date: '10h ago',
    expect: new Date(Date.now() - ms('10h')), 
  },
  {
    date: 'Jun 12, 2023 11:19AM EDT',
    expect: new Date('Jun 12, 2023, 11:19 AM EDT'), 
  },
  {
    date: '20 May 2023 • 3:26pm',
    expect: new Date('May 20, 2023 3:26 PM EDT'), 
  },
  {
    date: 'by Lauren Sforza - 11/24/23 6:03 PM ET',
    expect: new Date('Nov 24, 2023 6:03 PM EST'), 
  },
  {
    date: 'Dec 24, 2023 at 06:27 PM EDT',
    expect: new Date('Dec 24, 2023 06:27 PM EDT'), 
  },
  {
    date: 'Jan 24, 2023 at 06:27 a.m. EDT',
    expect: new Date('Jan 24, 2023 06:27 AM EDT'), 
  },
  {
    date: 'Tue 25 Mar 2023 11.05 EDT',
    expect: new Date('Tue 25 Mar 2023 11:05 AM EDT'), 
  },
  {
    date: '2023-09-25 10:31:28',
    expect: new Date('Sep 25, 2023 10:31:28'), 
  },
  {
    date: '07/25/2023 10:31 AM EDT',
    expect: new Date('Jul 25, 2023 10:31 AM EDT'), 
  },
  {
    date: '08/25/2023 5 AM EDT',
    expect: new Date('Aug 25, 2023 5:00 AM EDT'), 
  },
  {
    date: 'April 25, 2023 + 9:30 - 10:45 am EDT',
    expect: new Date('April 25, 2023 9:30 AM EDT'), 
  },
  {
    date: '1:47 PM EDT, Tue April 25, 2023',
    expect: new Date('Apr 25, 2023 1:47 PM EDT'),
  },
  {
    date: 'By Mike Headrick, KSL-TV | Posted - April 25, 2023 at 1:31 p.m.',
    expect: new Date('Apr 25, 2023 1:31 PM'),
  },
  {
    date: '2023-04-17 12:22:23.000000-0400',
    expect: new Date('Apr 17, 2023 12:22:23 PM GMT-0400'),
  }
];

describe('date tests', () => {
  for (const date of DATES) {
    test(`parsing: ${date}`, async () => {
      const parsedDate = parseDate(date.date);
      expect(parsedDate.toLocaleDateString()).toEqual(date.expect.toLocaleDateString());
      expect(parsedDate.toTimeString()).toEqual(date.expect.toTimeString());
    });
  }
});
