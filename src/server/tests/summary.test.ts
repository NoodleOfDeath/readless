import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Summary } from '../src/api/v1/schema';
import { DBService } from '../src/services';

jest.setTimeout(180_000);

describe('summary unit tests', () => {

  test('associateSibling', async () => {
    try {
      await DBService.prepare();
      const summary = await Summary.findByPk(1441);
      await summary.dropAllSiblings();
      await summary.associateWith(1443);
      await summary.associateWith(1317);
      await summary.associateWith(1318);
      const sibling = await Summary.findByPk(1320);
      await sibling.associateWith(1340);
      console.log(await summary.getSiblings());
      await sibling.associateWith(1318);
      const siblings = await summary.getSiblings();
      expect(siblings).toBeDefined();
    } catch (e) {
      console.log(e);
    }
  });

});
