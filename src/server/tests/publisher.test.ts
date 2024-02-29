import 'dotenv/config';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { col, fn } from 'sequelize';

import { Publisher, PublisherInteraction } from '../src/api/v1/schema';
import { DBService, S3Service } from '../src/services';

jest.setTimeout(30_000);

describe('publisher', () => {
  
  test('sample', async () => {
    await DBService.prepare();
    await Publisher.prepare();
    const publishers = await Publisher.findAll();
    for (const publisher of publishers) {
      const icon = await S3Service.download(publisher.icon ?? '');
      console.log(icon);
      expect(icon).toBeDefined();
    }
  });

  test('interactions', async () => {
    await DBService.prepare();
    const publishers = Object.fromEntries(((await PublisherInteraction.findAll({
      attributes: ['targetId', [fn('max', col('publisher_interaction.createdAt')), 'createdAt']],
      group: ['targetId', col('publisher.name'), col('publisher.displayName'), col('publisher.imageUrl'), col('publisher.description')],
      include: [Publisher.scope('public')],
      order: [[fn('max', col('publisher_interaction.createdAt')), 'desc'], ['targetId', 'desc']],
      where: {
        revert: false,
        type: 'follow',
        userId: 435,
      },
    })) as (PublisherInteraction & { publisher: Publisher })[]).map((i) => [i.publisher.name, true]));
    expect(publishers).toBeDefined();
    console.log(publishers);
  });

});