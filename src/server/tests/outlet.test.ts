import 'dotenv/config';
import fs from 'fs';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { Selector } from '../src/api/v1/schema/types';

jest.setTimeout(30_000);

describe('tests to make sure the selector class works', () => {

  test('tests the selector class', async () => {
    //
    const s = Selector.href('news');
    expect(s.selector).toBe('a[href*="/news/"]');
    //
    const b = s.href('story').href('entertainment');
    expect(b.selector).toBe('a[href*="/news/"],a[href*="/story/"],a[href*="/entertainment/"]');
    //
  });

});
