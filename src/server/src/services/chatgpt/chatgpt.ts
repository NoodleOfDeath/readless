import { ChatGPTAPI, ChatMessage, SendMessageOptions } from 'chatgpt';
import { BaseService } from '../base';

export type Prompt = {
  text: string;
  prefix?: string;
  action: <T>(reply: ChatMessage, target?: T) => void;
};

export type ChatGPTServiceInitProps = {
  apiKey?: string;
};

export class ChatGPTService extends BaseService {
  api: ChatGPTAPI;
  conversationId?: string;
  parentMessageId?: string;

  constructor({ apiKey = process.env.OPENAI_API_KEY }: ChatGPTServiceInitProps = {}) {
    super();
    this.api = new ChatGPTAPI({
      apiKey,
    });
  }

  async send(
    message: string,
    {
      conversationId = this.conversationId,
      parentMessageId = this.parentMessageId,
      ...remainingOpts
    }: SendMessageOptions = {},
  ) {
    try {
      const reply = await this.api.sendMessage(message, { conversationId, parentMessageId, ...remainingOpts });
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
