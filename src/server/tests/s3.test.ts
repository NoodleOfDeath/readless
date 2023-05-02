import 'dotenv/config';

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
    file = await S3Service.download('https://api.deepai.org/job-view-file/8e7d8ebc-85d4-4307-839c-03af31b294bf/outputs/output.jpg');
    console.log(file);
    expect(true).toBe(true);
  });
  
  test('upload file', async () => {
    const response = await S3Service.uploadObject({
      ACL: 'public-read',
      ContentType: 'image/jpeg',
      File: file,
      Folder: 'img/s',
    });
    console.log(response);
    expect(true).toBe(true);
  });

});