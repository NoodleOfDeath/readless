import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import axios from 'axios';

jest.setTimeout(30_000);

const url = 'https://www.boringreport.org';

describe('puppet load', () => {
  test('puppet load', async () => {
    try {
      const response = await axios.get(url, { headers: {} });
      console.log(response);
      expect(response).toBeDefined();
    } catch (e) {
      console.error(e);
    }
  });
});
