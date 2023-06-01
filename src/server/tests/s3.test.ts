import 'dotenv/config';
import p from 'path';

import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { S3Service } from '../src/services/aws';

jest.setTimeout(30_000);

describe('uploads to the s3 bucket', () => {
  
  let file: string;

  test('download file', async () => {
    file = await S3Service.download('https://peregrine-results.s3.amazonaws.com/pigeon/rJdGgwtyiCFPUYV9nA_0.mp3', { filetype: 'mp3' });
    console.log(file);
    expect(true).toBe(true);
  });
  
  test('put file', async () => {
    const response = await S3Service.uploadObject({
      ContentType: 'audio/mpeg',
      File: file,
      Folder: 'audio/s',
    });
    console.log(response);
    expect(response).toBeDefined();
  });
  
  test('get file', async () => {
    const response = await S3Service.getObject({ Key: `audio/s/${file ? p.basename(file) : 'test.mp3'}` });
    console.log(response);
    expect(response).toBeDefined();
  });

});