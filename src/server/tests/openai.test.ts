import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { CATEGORIES } from '../src/api/v1/schema';
import { OpenAIService } from '../src/services/openai/OpenAIService';

jest.setTimeout(30_000);

describe('function tests', () => {

  test('create person', async () => {
    const openai = new OpenAIService();
    try {
      const reply = await openai.send('call createPerson for an asshole working on himself. yay! fucking hate that dude, but he is family. i love him', {
        function_call: { name: 'createPerson' },
        functions: [
          {
            name: 'createPerson',
            parameters: {
              properties: {
                name: { type: 'string' },
                sentiment: {
                  decimals: 1, 
                  max: 1, 
                  min: -1, 
                  type: 'number',
                },
              },
              required: ['name', 'age'],
              type: 'object',
            },
          },
        ],
      });
      expect(reply).toBeDefined();
      console.log(reply);
    } catch (e) {
      console.log(e);
    }
  });
  test('create summary', async () => {
    const openai = new OpenAIService();
    try {
      const tests = [
        'This website uses cookies. You can opt out anytime',
        'NEW YORK — Michael Cohen, Donald Trump\'s onetime personal lawyer and fixer, says he unwittingly passed along to his attorney bogus artificial intelligence-generated legal case citations he got online before they were submitted to a judge.\n\nCohen made the admission in a court filing unsealed Friday in Manhattan federal court after a judge earlier this month asked a lawyer to explain how court rulings that do not exist were cited in a motion submitted on Cohen\'s behalf. Judge Jesse Furman had also asked what role, if any, Cohen played in drafting the motion.\n\nThe AI-generated cases were cited as part of written arguments attorney David M. Schwartz made to try to bring an early end to Cohen\'s court supervision after he served more than a year behind bars. Cohen had pleaded guilty in 2018 to tax evasion, campaign finance charges and lying to Congress, saying Trump directed him to arrange the payment of hush money to a porn actor and to a former Playboy model to fend off damage to his 2016 presidential bid.',
      ];
      for (const content of tests) {
        const reply = await openai.send(`Call createSummary and return a new summary instance for the following article. A collection of article headlines, pictures, videos, advertisements, description of a news website, or subscription program should not be considered a news article/story. If the following is not an article or story return an empty object {}:\n\n${content}`, {
          function_call: { name: 'createSummary' },
          functions: [
            {
              name: 'createSummary',
              parameters: {
                properties: {
                  bullets: {
                    items: {
                      maxLength: 50, 
                      type: 'string', 
                    }, 
                    length: 5,
                    type: 'array', 
                  },
                  category: {
                    enum: Object.keys(CATEGORIES),
                    type: 'string',
                  },
                  sentiment: {
                    max: 1,
                    min: -1,
                    type: 'double',
                  },
                  shortSummary: { maxLength: 150, type: 'string' },
                  summary: { maxLength: 500, type: 'string' },
                  title: { maxLength: 50, type: 'string' },
                },
                required: ['title', 'shortSummary', 'summary', 'bullets', 'category'],
                type: 'object',
              },
            },
          ],
        });
        expect(reply).toBeDefined();
        console.log(reply);
      }
    } catch (e) {
      console.log(e);
    }
  });

});
