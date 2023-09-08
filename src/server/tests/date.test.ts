import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import ms from 'ms';

import { maxDate, parseDate } from '../src/utils';

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
    date: '1 hour ago', 
    expect: new Date(Date.now() - ms('1h')), 
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
    date: '22 minutes ago',
    expect: new Date(Date.now() - ms('22m')),
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
    date: 'Apr 27 2023 7:55 PM EDT11 Hours Ago',
    expect: new Date('Apr 27, 2023 7:55 PM EDT'), 
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
  },
  {
    date: 'Published: 10:16 a.m. ET April 27, 2023 Updated: 8:28 p.m. ET April 27, 2023',
    expect: new Date('Apr 27, 2023 10:16 AM EST'),
  },
  {
    date: `${new Date().toLocaleDateString()} 11:12 am`,
    expect: new Date(`${new Date().toLocaleDateString()} 11:12 AM`),
  },
  {
    date: 'Presented By Mind ·chatbotsNational Eating Disorder Association replaces human helpline staff with an AI chatbotBYChris MorrisMay 26, 2023, 3:26 PM UTC<img alt="" sizes="100vw" srcSet="https://content.fortune.co',
    expect: new Date('May 26, 2023 3:26 PM UTC'),
  },
  {
    date: 'Wed 7 Jun 2023 20.19 EDT',
    expect: new Date('Jun 7, 2023 8:19 PM EDT'),
  },
  {
    date: '2023-09-08T10:06:07.000Z',
    expect: new Date('2023-09-08T10:06:07.000Z'),
  },
  { 
    date: '"I first made Read Less for myself, but having lived with a disability for 14 years, I wanted to make the news more accessible and faster to read for marginalized groups.”— Thom MorganALEXANDRIA, VA, UNITED STATES, September 6, 2023 /EINPresswire.com/ -- "Read Less" is set to change the narrative for those who struggle to read or keep up with current events. Going beyond just delivering efficient, digestible news - It aims to disrupt the cycle of digital addiction and integrate naturally into users',
    expect: new Date('September 6, 2023'),
  },
];

describe('date tests', () => {

  DATES.forEach((date, i) => {
    test(`parse-${i}`, async () => {
      const parsedDate = parseDate(date.date);
      console.log(i, ' >> ', parsedDate?.toLocaleString(), date.expect.toLocaleString());
      expect(parsedDate).toBeDefined();
      expect(parsedDate?.toLocaleDateString()).toEqual(date.expect.toLocaleDateString());
      expect(parsedDate?.toTimeString()).toEqual(date.expect.toTimeString());
    });
  });

  test('max-date', () => {
    const dates = ['20 hours ago', '2023-09-08T10:06:07.000Z'];
    const max = maxDate(...dates);
    expect(max).toBeDefined();
    expect(max).toBeInstanceOf(Date);
    expect(max).toEqual(new Date('2023-09-08T10:06:07.000Z'));
  });

});
