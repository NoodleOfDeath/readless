import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';
import { BaseService } from '../base';

export type Prompt = {
  text: string;
  prefix?: string;
  size?: number;
  action: (reply: ChatMessage) => void;
};

export type ChatGPTServiceInitProps = {
  apiKey?: string;
  maxResponseTokens?: number;
};

export class ChatGPTService extends BaseService {
  api: ChatGPTAPI;
  conversationId?: string;
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
      conversationId = this.conversationId,
      parentMessageId = this.parentMessageId,
      timeoutMs = 120_000,
      ...remainingOpts
    }: SendMessageOptions = {},
  ) {
    try {
      const reply = await this.api.sendMessage(message, {
        conversationId,
        parentMessageId,
        timeoutMs,
        ...remainingOpts,
      });
      this.conversationId = reply.conversationId;
      this.parentMessageId = reply.id;
      return reply;
    } catch (e) {
      console.error(e);
    }
  }

  abandonConversation() {
    delete this.conversationId;
    delete this.parentMessageId;
  }
}
