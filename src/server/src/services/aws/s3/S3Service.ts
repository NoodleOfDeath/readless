// Step 1: Import the S3Client object and all necessary SDK commands.
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

import { BaseService } from '../../base';

type S3ServiceOptions = {
  endpoint?: string;
  forcePathStyle?: boolean;
  region?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

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
  }: S3ServiceOptions = {}) {
    super();
    this.s3Client = new S3Client({
      credentials,
      endpoint,
      forcePathStyle,
      region,
    });
  }

  async uploadObject(params: PutObjectCommandInput) {
    try {
      const data = await this.s3Client.send(new PutObjectCommand(params));
      return data;
    } catch (err) {
      console.log('Error', err);
    }
  }

}
