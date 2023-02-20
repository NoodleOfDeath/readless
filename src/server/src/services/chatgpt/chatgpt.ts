import { ChatGPTAPI, SendMessageOptions } from 'chatgpt';
import { BaseService } from '../base';

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
    opts: SendMessageOptions = {
      conversationId: this.conversationId,
      parentMessageId: this.parentMessageId,
    },
  ) {
    try {
      const reply = await this.api.sendMessage(message, opts);
      this.conversationId = reply.conversationId;
      this.parentMessageId = reply.id;
    } catch (e) {
      console.error(e);
    }
  }

  abandonConversation() {
    delete this.conversationId;
    delete this.parentMessageId;
  }
}
