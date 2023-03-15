import { Configuration, OpenAIApi } from 'openai';

import { BaseService } from '../base';

export type OpenAIServiceInitProps = {
  apiKey?: string;
};

export type CreateImageOptions = {
  n?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  size?: '256x256' | '512x512' | '1024x1024';
}

export class OpenAIService extends BaseService {
  api: OpenAIApi;

  constructor({ apiKey = process.env.OPENAI_API_KEY }: OpenAIServiceInitProps = {}) {
    super();
    this.api = new OpenAIApi(
      new Configuration({ apiKey, }),
    );
  }
  
  async createImage(
    prompt: string, {
      n = 1,
      size = '1024x1024'
    }: CreateImageOptions = {}) {
    return await this.api.createImage({
      prompt, n, size 
    });
  }
  
}
