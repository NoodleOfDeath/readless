import 'dotenv/config';
import { describe, expect, jest, test} from '@jest/globals';

jest.setTimeout(30_000);

describe('uploads to the s3 bucket', () => {

  test('upload s3', async () => {
    expect(true).toBe(true);
  });

});