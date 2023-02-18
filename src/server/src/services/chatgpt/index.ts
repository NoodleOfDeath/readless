import { ChatGPTAPI } from 'chatgpt';
import { BaseService } from '@/services/base';

type SendOptions = {
  message: string;
  conversationId?: string;
  parentMessageId?: string;
}

export class ChatGPTService extends BaseService {
  
  api: ChatGPTAPI;
  
  static get default() {
    return new ChatGPTService();
  }
  
  constructor({ apiKey = process.env.OPENAI_API_KEY }: { apiKey: string} = {}) {
    this.api = new ChatGPTAPI({
      apiKey,
    });
  }
  
  send({ message, conversationId, parentMessageId }: SendOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this.api.sendMessage('Hello World!')
    }
  }
  
}