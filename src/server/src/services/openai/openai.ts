import {
  Configuration,
  CreateCompletionRequest,
  OpenAIApi,
} from 'openai';

import { BaseService } from '../base';

export type OpenAIServiceInitProps = {
  apiKey?: string;
};

export class OpenAIService extends BaseService {

  api: OpenAIApi;

  constructor({ apiKey = process.env.OPENAI_API_KEY }: OpenAIServiceInitProps = {}) {
    super();
    this.api = new OpenAIApi(new Configuration({ apiKey }));
  }
  
  async sendMessage(prompt: string, {
    model = 'gpt3.5',
    max_tokens = 150,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: Partial<CreateCompletionRequest> = {}) {
    // return await this.api.createCompletion({
    //   max_tokens, 
    //   model,
    //   prompt,
    // });
  }
  
}
