import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Alias } from '../src/api/v1/schema';
import { DBService, MailService } from '../src/services';

jest.setTimeout(30_000);

describe('tests mail service', () => {
  
  test('test', async () => {
    await new MailService().sendMail({
      subject: 'test',
      text: 'test',
      to: 'thom@readless.ai',
    });
    expect(true).toBe(true);
  });

  test('mass-email', async () => {
    await DBService.prepare();
    const aliases = await Alias.findAll({ where: { type: 'email' } });
    const service = new MailService();
    for (const alias of aliases) {
      await service.sendMail({
        subject: 'Thanks for Using Read Less',
        text: 'test',
        to: alias.value,
      });
    }
  });

});