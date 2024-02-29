import fs from 'fs';
import p from 'path';
import { Readable } from 'stream';

import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  RestoreObjectCommand,
  RestoreObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import axios from 'axios';
import mime from 'mime-types';
import { v1 } from 'uuid';

import { BaseService } from '../../base';

export type DownloadOptions = {
  filetype?: string;
  filename?: string;
  filepath?: string;
  accept?: string;
  minSize?: number;
};

export type GetOptions = Omit<GetObjectCommandInput, 'Bucket'> & {
  Bucket?: string;
  Provider?: string;
};

export type ListOptions = Omit<ListObjectsV2CommandInput, 'Bucket'> & {
  Bucket?: string;
  Provider?: string;
};

export type PutOptions = Omit<PutObjectCommandInput, 'Body' | 'Bucket' | 'ContentType' | 'Key'> & {
  Bucket?: string;
  Body?: string;
  ContentType?: string;
  File?: string;
  Folder?: string;
  Key?: string;
  Provider?: string;
  Accept?: string;
  MinSize?: number;
};

export type DeleteOptions = Omit<DeleteObjectCommandInput, 'Bucket'> & {
  Bucket?: string;
  Provider?: string;
  Folder?: string;
};

export type RestoreOptions = Omit<RestoreObjectCommandInput, 'Bucket'> & {
  Bucket?: string;
  Provider?: string;
};

export class S3Service extends BaseService {

  public static s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
    },
    endpoint: process.env.S3_ENDPOINT || 'https://nyc3.digitaloceanspaces.com',
    forcePathStyle: false,
    region: process.env.S3_REGION || 'nyc3',
  });
  
  public static toBlob(url: string) {
    const matches = /^(?:data:(\w+(?:\/\w+)?);base64,)(.*)$/.exec(url);
    if (!matches) {
      return;
    }
    const [, mimeType, data] = matches;
    return {
      data,
      ext: mime.extension(mimeType) || 'application/octet-stream',
      mimeType,
    };
  }
  
  public static async download(url: string, {
    filetype, 
    filename,
    filepath,
    accept,
    minSize = 10,
  }: DownloadOptions = {}): Promise<string> {
    const base64 = this.toBlob(url);
    if (base64) {
      if (accept && !new RegExp(accept, 'i').test(base64.mimeType)) {
        throw new Error('Unexpected response type');
      }
      filetype = base64.ext;
      if (!filename) {
        filename = `${v1()}.${filetype}`;
      }
      if (!filepath) {
        filepath = `/tmp/${filename}`;
      }
      fs.writeFileSync(filepath, base64.data, 'base64');
      return filepath;
    }
    const response = await axios.get(url, { responseType: 'stream' });
    if (accept && !new RegExp(accept, 'i').test(response.headers['content-type'])) {
      throw new Error('Unexpected response type');
    }
    const contentLength = Number(response.headers['content-length']);
    if (Number.isNaN(contentLength) || contentLength < minSize) {
      throw new Error('Bad file');
    }
    if (!filetype) {
      filetype = mime.extension(response.headers['content-type']) || 'bin';
    }
    if (!filename) {
      filename = `${v1()}.${filetype}`;
    }
    if (!filepath) {
      filepath = `/tmp/${filename}`;
    }
    console.log('Downloaded', filepath);
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(filepath));
    });
  }
  
  public static async getObject(options: GetOptions, filepath = `/tmp/${v1()}`): Promise<string> {
    const params = {
      ...options,
      Bucket: options.Bucket || process.env.S3_BUCKET,
      Provider: options.Provider || process.env.S3_PROVIDER || 'nyc3.digitaloceanspaces.com',
    };
    if (!params.Bucket) {
      throw new Error('Malformed bucket');
    }
    if (!params.Key) {
      throw new Error('Malformed key');
    }
    const response = await this.s3Client.send(new GetObjectCommand(params));
    filepath = `${filepath}.${mime.extension(response.ContentType) || mime.extension(mime.lookup(response.ContentType) || '')}`;
    const stream = response.Body as Readable;
    return new Promise((resolve, reject) => {
      stream.pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(filepath));
    });
  }
  
  public static async listObjects(options: ListOptions = {}) {
    const params = {
      ...options,
      Bucket: options.Bucket || process.env.S3_BUCKET,
      MaxKeys: options.MaxKeys,
      Provider: options.Provider || process.env.S3_PROVIDER || 'nyc3.digitaloceanspaces.com',
    };
    if (!params.Bucket) {
      throw new Error('Malformed bucket');
    }
    let isTruncated = true;
    const items: string[] = [];
    const command = new ListObjectsV2Command(params);
    while (isTruncated) {
      const {
        Contents, IsTruncated, NextContinuationToken, 
      } = await this.s3Client.send(command);
      items.push(...Contents.map((c) => c.Key));
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    return items;
  }

  public static async putObject(options: PutOptions) {
    const params = {
      ...options,
      Body: options.Body || options.File ? fs.readFileSync(options.File) : null,
      Bucket: options.Bucket || process.env.S3_BUCKET,
      ContentType: options.ContentType || mime.contentType(options.File) || 'application/octet-stream', 
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
      key: params.Key,
      url,
    };
  }
  
  public static async deleteObject(options: DeleteOptions) {
    const params = {
      ...options,
      Bucket: options.Bucket || process.env.S3_BUCKET,
      Key: options.Folder ? [options.Folder, options.Key].join('/') : options.Key,
      Provider: options.Provider || process.env.S3_PROVIDER || 'nyc3.digitaloceanspaces.com',
    };
    const data = await this.s3Client.send(new DeleteObjectCommand(params));
    return data;
  }
  
  public static async restoreObject(options: RestoreOptions) {
    const params = {
      ...options,
      Bucket: options.Bucket || process.env.S3_BUCKET,
      Provider: options.Provider || process.env.S3_PROVIDER || 'nyc3.digitaloceanspaces.com',
    };
    if (!params.Bucket) {
      throw new Error('Malformed bucket');
    }
    const data = await this.s3Client.send(new RestoreObjectCommand(params));
    return data;
  }
  
  public static async mirror(url: string, options: PutOptions) {
    try {
      const file = await this.download(url, { 
        accept: options.Accept, 
        minSize: options.MinSize,
      });
      const response = await this.putObject({ ...options, File: file });
      fs.unlinkSync(file);
      return response;
    } catch (e) {
      console.error(e);
    }
  }

}
