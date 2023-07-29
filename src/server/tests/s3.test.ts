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
    file = await S3Service.download('https://ca-times.brightspotcdn.com/dims4/default/b9aa17d/2147483647/strip/true/crop/5934x3957+0+0/resize/1200x800!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F1c%2Fe4%2Ff81116cb31124a04a7049a0a36d0%2Fd53d3b0d50604c2691b5c3949e0271dc', { filetype: '' });
    console.log(file);
    expect(true).toBe(true);
  });
  
  test('put file', async () => {
    const response = await S3Service.putObject({
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