import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Publisher, Summary } from '../src/api/v1/schema';
import { DBService, ScribeService } from '../src/services';

jest.setTimeout(180_000);

describe('summary unit tests', () => {

  test('associateSibling', async () => {
    try {
      await DBService.prepare();
      const summary = await Summary.findByPk(1441);
      if (!summary) {
        throw new Error('Summary not found');
      }
      await summary.dropAllSiblings();
      await summary.associateWith(1443);
      await summary.associateWith(1317);
      await summary.associateWith(1318);
      const sibling = await Summary.findByPk(1320);
      if (!sibling) {
        throw new Error('Sibling not found');
      }
      await sibling.associateWith(1340);
      console.log(await summary.getSiblings());
      await sibling.associateWith(1318);
      const siblings = await summary.getSiblings();
      expect(siblings).toBeDefined();
    } catch (e) {
      console.log(e);
    }
  });

  test('summarize', async () => {
    await DBService.prepare();
    await ScribeService.prepare();
    await Publisher.prepare();
    const publisher = await Publisher.findOne({ where: { name: 'espn' } });
    if (!publisher) {
      throw new Error('Publisher not found');
    }
    const summary = await ScribeService.readAndSummarize({
      publisher,
      url: 'https://www.espn.com/mlb/insider/insider/story/_/id/39210708/mlb-free-agency-trade-braves-red-sox-chris-sale-2023-24',
    });
    expect(summary).toBeDefined();
  });

});
