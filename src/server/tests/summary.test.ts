import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Summary } from '../src/api/v1/schema';
import { DBService } from '../src/services';

jest.setTimeout(90_000);

describe('summary unit tests', () => {

  test('associateSibling', async () => {
    try {
      await DBService.initTables();
      const summary = await Summary.findByPk(1315);
      await summary.dropAllSiblings();
      await summary.associateWith(1316);
      await summary.associateWith(1317);
      const sibling = await Summary.findByPk(1316);
      await sibling.associateWith(1318);
      const siblings = await summary.getSiblings();
      expect(siblings).toBeDefined();
      console.log(siblings);
    } catch (e) {
      console.log(e);
    }
  });

});
