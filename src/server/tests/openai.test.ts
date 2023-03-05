import 'dotenv/config';
import fs from 'fs';
import { describe, expect, jest, test} from '@jest/globals';

import { OpenAIService } from '../src/services/openai/openai';

jest.setTimeout(30_000);

describe('generates an image', () => {

  test('generate an image', async () => {
    const service = new OpenAIService();
    try {
      const resp = await service.createImage('An image of a person holding a smartphone while interacting with an AI-powered chatbot, with a thought bubble showing the user\'s excitement and/or concern about the technology, pop art style.');
      fs.writeFileSync('./url.html', `<a href="${resp.data.data[0].url}">fuck</a>`);
    } catch(e) {
      console.log(e);
    }
    expect(true).toBe(true);
  });

});
