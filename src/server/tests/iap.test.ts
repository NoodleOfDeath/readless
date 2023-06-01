import 'dotenv/config';
import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { IapService } from '../src/services/iap';

jest.setTimeout(30_000);

describe('tests the iap service methods', () => {
  
  test('verify apple iap', async () => {
    const resp = await IapService.verifyAppleReceipt({ receipt: '' });
    expect(resp).toBeDefined();
    console.log(resp);
  });
  
  test('verify google iap', async () => {
    const resp = await IapService.verifyGoogleReceipt({ receipt: '' });
    expect(resp).toBeDefined();
    console.log(resp);
  });

});