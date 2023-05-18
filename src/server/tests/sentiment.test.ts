import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import Sentiment from 'sentiment';

jest.setTimeout(30_000);

const prompts = [
  'Michigan bans firing workers for getting abortion.',
  'Republicans demand CIA documents related to Hunter Biden laptop.',
  'Mexico issues first non-binary passport to Ociel Baena.',
];

describe('tests sentiments', () => {
  
  test('sentiment', async () => {
    const sentiment = new Sentiment();
    for (const prompt of prompts) {
      const s = sentiment.analyze(prompt);
      expect(s).toBeDefined();
      console.log(s);
    }
  });

});