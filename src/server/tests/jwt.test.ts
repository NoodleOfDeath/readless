import 'dotenv/config';
import jwt from 'jsonwebtoken';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

jest.setTimeout(30_000);

describe('experiments with jwt', () => {

  test('jwt test', () => {
    const payload = () => ({
      userId: 20,
      priority: 10,
      expiresAt: new Date(),
    });
    try {
      const a = jwt.sign(payload(), process.env.JWT_SECRET, { expiresIn: '1d' });
      const b = jwt.sign(payload(), process.env.JWT_SECRET, { expiresIn: '1d' });
      console.log(a, b);
      expect(a).not.toBe(b);
    } catch (e) {
      console.log(e);
    }
  });

});
