import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { TtsService } from '../src/services/tts';

jest.setTimeout(30_000);

describe('tests the tts service methods', () => {
  
  test('generate tts', async () => {
    const clip = await TtsService.generate({
      text: 'test',
      voice: 'larry',
    });
    expect(clip).toBeDefined();
    console.log(clip);
  });

});