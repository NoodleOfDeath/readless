import 'dotenv/config';
import fs from 'fs';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { DBService, StaticGeneratorService } from '../src/services';

jest.setTimeout(180_000);

describe('generate sitemap', () => {

  test('generate sitemap', async () => {
    try {
      await DBService.prepare();
      const xml = await StaticGeneratorService.generateSitemap();
      expect(xml).toBeDefined();
      console.log(xml);
      fs.writeFileSync('./sitemap.xml', xml);
    } catch (e) {
      console.log(e);
    }
  });

});
