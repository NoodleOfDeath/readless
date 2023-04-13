import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import axios from 'axios';

jest.setTimeout(30_000);

const url = 'https://www.nytimes.com/2023/04/12/climate/biden-electric-cars-epa.html';

describe('nytimes tests', () => {
  test('webscrape nytimes', async () => {
    try {
      const response = await axios.get(url, { headers: {} });
      console.log(response);
      expect(response).toBeDefined();
    } catch (e) {
      console.error(e);
    }
  });
});
