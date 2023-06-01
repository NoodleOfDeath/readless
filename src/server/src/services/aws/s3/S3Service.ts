import fs from 'fs';
import p from 'path';

import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import axios from 'axios';
import { v1 as uuid } from 'uuid';

import { BaseService } from '../../base';

export type DownloadOptions = {
  filetype?: string;
  filename?: string;
  filepath?: string;
};

export type UploadOptions = Omit<PutObjectCommandInput, 'Body' | 'Bucket' | 'Key'> & {
  Bucket?: string;
  Body?: string;
  File?: string;
  Folder?: string;
  Key?: string;
  Provider?: string;
};

export class S3Service extends BaseService {

  public static s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
    },
    endpoint: process.env.S3_SERVICE_ENDPOINT || 'https://nyc3.digitaloceanspaces.com',
    forcePathStyle: false,
    region: process.env.S3_REGION || 'nyc3',
  });
  
  public static async download(url: string, {
    filetype = 'jpg', 
    filename = `${uuid()}.${filetype}`,
    filepath = `/tmp/${filename}`,
  }: DownloadOptions = {}): Promise<string> {
    const response = await axios.get(url, { responseType: 'stream' });
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(filepath));
    });
  }

  public static async uploadObject(options: UploadOptions) {
    const params = {
      ...options,
      Body: options.Body ? options.Body : options.File ? fs.readFileSync(options.File) : null,
      Bucket: options.Bucket ? options.Bucket : process.env.S3_BUCKET,
      Key: options.Folder ? [options.Folder, options.File ? p.basename(options.File) : options.Key].join('/') : options.Key,
      Provider: options.Provider || process.env.S3_PROVIDER || 'nyc3.digitaloceanspaces.com',
    };
    if (!params.Body) {
      throw new Error('Malformed body');
    }
    if (!params.Bucket) {
      throw new Error('Malformed bucket');
    }
    if (!params.Key) {
      throw new Error('Malformed key');
    }
    const data = await this.s3Client.send(new PutObjectCommand(params));
    const url = `https://${params.Bucket}.${params.Provider}/${params.Key}`;
    return {
      ...data,
      url,
    };
  }

  public static async mirror(url: string, options: UploadOptions = {}) {
    const file = await this.download(url);
    const response = await this.uploadObject({ ...options, File: file });
    try {
      fs.unlinkSync(file);
    } catch (e) {
      console.log(e);
    }
    return response;
  }

}
