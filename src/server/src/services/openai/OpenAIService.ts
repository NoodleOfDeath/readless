import { ClientOptions, OpenAI } from 'openai';
import {
  ChatCompletionCreateParams,
  ChatCompletionMessage,
  ChatCompletionUserMessageParam,
} from 'openai/resources';

import { BaseService } from '../base';

export type Prompt = {
  text: string;
  handleReply: (reply: string) => Promise<void>;
};

export type OpenAIServiceOptions = ClientOptions & {
  persist: boolean;
};

export class OpenAIService extends BaseService {

  api: OpenAI;
  persist = false;
  messages: (ChatCompletionMessage | ChatCompletionUserMessageParam)[] = [];

  constructor({ apiKey = process.env.OPENAI_API_KEY, persist = false }: Partial<OpenAIServiceOptions> = {}) {
    super();
    this.api = new OpenAI({ apiKey });
    this.persist = persist;
  }
  
  async send<T = string>(prompt: string, { 
    model = 'gpt-3.5-turbo-0613',
    functions,
    function_call,
  }: Partial<ChatCompletionCreateParams> = {}) {
    const message: ChatCompletionUserMessageParam = {
      content: prompt.slice(0, 4096),
      role: 'user',
    };
    if (this.persist) {
      this.messages.push(message);
    }
    const response = await this.api.chat.completions.create({
      function_call,
      functions,
      messages: !this.persist ? [message] : this.messages,
      model,
    });
    if (response.choices) {
      const message = response.choices[0].message;
      if (this.persist) {
        this.messages.push(message);
      }
      if (function_call && message.function_call) {
        if (!message.function_call.arguments) {
          return undefined;
        }
        return JSON.parse(message.function_call.arguments) as T;
      }
      return message.content as T;
    }
    throw new Error('Bad response from OpenAI');
  }

  clearConversation() {
    this.messages = [];
  }
  
}
