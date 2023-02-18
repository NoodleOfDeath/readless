import { ChatGPTAPI } from 'chatgpt';
import { BaseService } from '@/services/base';

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class ChatGPTService extends BaseService {
  
  
}