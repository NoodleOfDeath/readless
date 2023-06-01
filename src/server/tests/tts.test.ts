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
  
  test('voices', async () => {
    const voices = await TtsService.getVoices();
    expect(voices).toBeDefined();
    console.log(voices);
  });
  
  test('generate', async () => {
    const clip = await TtsService.generate({
      text: 'From Fox News - Nebraska prison attack injures five staff members. I want you deep inside me!',
      voice: 'charlotte',
    });
    expect(clip).toBeDefined();
    console.log(clip);
  });

});