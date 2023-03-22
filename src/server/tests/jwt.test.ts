import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import jwt from 'jsonwebtoken';

jest.setTimeout(30_000);

describe('experiments with jwt', () => {

  test('jwt test', () => {
    const payload = () => ({
      expiresAt: new Date(),
      priority: 10,
      userId: 20,
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
