import {
  ChatGPTAPI,
  ChatMessage,
  SendMessageOptions,
} from 'chatgpt';

import { BaseService } from '../base';

export type Prompt = {
  text: string;
  size?: number;
  handleReply: (reply: ChatMessage) => Promise<void>;
};

export type ChatGPTServiceInitProps = {
  apiKey?: string;
  maxResponseTokens?: number;
};

export class ChatGPTService extends BaseService {

  api: ChatGPTAPI;
  parentMessageId?: string;

  constructor({ apiKey = process.env.OPENAI_API_KEY, maxResponseTokens = 1_000 }: ChatGPTServiceInitProps = {}) {
    super();
    this.api = new ChatGPTAPI({
      apiKey,
      maxResponseTokens,
    });
  }

  async send(
    message: string,
    {
      parentMessageId = this.parentMessageId, timeoutMs = 120_000, ...remainingOpts 
    }: SendMessageOptions = {}
  ) {
    try {
      const reply = await this.api.sendMessage(message, {
        parentMessageId,
        timeoutMs,
        ...remainingOpts,
      });
      this.parentMessageId = reply.id;
      return reply;
    } catch (e) {
      console.error(e);
    }
  }

  abandonConversation() {
    delete this.parentMessageId;
  }

}
