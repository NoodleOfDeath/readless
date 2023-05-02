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
  
  test('get voices', async () => {
    const voices = await TtsService.getVoices();
    expect(voices).toBeDefined();
    console.log(voices);
  });

  test('create a clip', async () => {
    const clip = await TtsService.createClip({
      body: 'of course i would like to clean your pipe, mr. plumber',
      callback_uri: '',
      is_archived: false,
      is_public: false,
      voice_uuid: '15be93bd',
    });
    expect(clip).toBeDefined();
    console.log(clip);
  });

});