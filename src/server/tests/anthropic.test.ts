import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { AnthropicService } from '../src/services';

jest.setTimeout(30_000);

describe('base test', () => {
  
  test('just asks a question', async () => {
    const service = new AnthropicService();
    const resp = await service.send('What is the answer to life?');
    console.log(resp);
    expect(resp).toBeDefined();
  });

});