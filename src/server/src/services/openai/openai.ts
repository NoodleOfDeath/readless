import { Configuration, OpenAIApi } from 'openai';
import { BaseService } from '../base';

export type OpenAIServiceInitProps = {
  apiKey?: string;
};

export class OpenAIService extends BaseService {
  api: OpenAIApi;

  constructor({ apiKey = process.env.OPENAI_API_KEY }: OpenAIServiceInitProps = {}) {
    super();
    this.api = new OpenAIApi(
      new Configuration({
        apiKey,
      }),
    );
  }
}
