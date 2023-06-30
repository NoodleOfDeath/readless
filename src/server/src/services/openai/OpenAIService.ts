import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  CreateCompletionRequest,
  OpenAIApi,
} from 'openai';

import { BaseService } from '../base';

export type ChatMessage = ChatCompletionRequestMessage & ChatCompletionResponseMessage;

export type Prompt = {
  text: string;
  handleReply: (reply: string) => Promise<void>;
};

export type OpenAIServiceInitProps = {
  apiKey?: string;
};

export class OpenAIService extends BaseService {

  api: OpenAIApi;
  messages: ChatMessage[] = [];

  constructor({ apiKey = process.env.OPENAI_API_KEY }: OpenAIServiceInitProps = {}) {
    super();
    this.api = new OpenAIApi(new Configuration({ apiKey }));
  }
  
  async send(prompt: string, { model = 'gpt-3.5-turbo-0613' }: Partial<CreateCompletionRequest> = {}) {
    this.messages.push({
      content: prompt,
      role: 'user',
    });
    const response = await this.api.createChatCompletion({
      messages: this.messages,
      model,
    });
    if (response.status === 200 && response.data?.choices?.length && response.data.choices[0].message) {
      this.messages.push(response.data.choices[0].message);
      return response.data.choices[0].message.content;
    }
    throw new Error(response.statusText);
  }

  clearConversation() {
    this.messages = [];
  }
  
}
