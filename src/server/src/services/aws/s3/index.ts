// Step 1: Import the S3Client object and all necessary SDK commands.
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { BaseService } from '../../base';

export class S3Service extends BaseService {
  s3Client: S3Client;

  constructor({
    endpoint = 'https://theskoop.nyc3.digitaloceanspaces.com',
    forcePathStyle = false,
    region = 'nyc3',
    credentials = {
      accessKeyId: 'C58A976M583E23R1O00N',
      secretAccessKey: process.env.SPACES_SECRET,
    },
  }: any = {}) {
    super();
    this.s3Client = new S3Client({
      endpoint,
      forcePathStyle,
      region,
      credentials,
    });
  }

  async uploadObject(params: any) {
    try {
      const data = await this.s3Client.send(new PutObjectCommand(params));
      return data;
    } catch (err) {
      console.log('Error', err);
    }
  }
}
