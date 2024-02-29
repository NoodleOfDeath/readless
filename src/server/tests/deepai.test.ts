import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { DeepAiService } from '../src/services/deepai';

jest.setTimeout(30_000);

describe('tests deepai image generation service', () => {
  
  test('text to image', async () => {
    const image = await DeepAiService.textToImage('katy perry');
    expect(image).toBeDefined();
    expect(image.output_url).toBeDefined();
    console.log(image);
  });

});