import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { DBService, S3Service } from '../src/services';
import { Publisher } from '../src/api/v1/schema';

jest.setTimeout(30_000);

describe('publisher', () => {
  
  test('sample', async () => {
    await DBService.prepare();
    await Publisher.prepare();
    const publishers = await Publisher.findAll();
    for (const publisher of publishers) {
      const icon = await S3Service.download(publisher.icon);
      console.log(icon);
    }
  });

});