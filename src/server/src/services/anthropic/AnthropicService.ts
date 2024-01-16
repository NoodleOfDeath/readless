import Anthropic from '@anthropic-ai/sdk';

import { BaseService } from '../base';

export type AnthropicServiceOptions = {
  apiKey: string;
};

export class AnthropicService extends BaseService {
  
  api: Anthropic;
  
  constructor({ apiKey = process.env.ANTHROPIC_API_KEY }: Partial<AnthropicServiceOptions> = {}) {
    super();
    this.api = new Anthropic({ apiKey });
  }

  async send(prompt: string, {
    model = 'claude-2.1',
    max_tokens_to_sample = 1000,
  }: Partial<Omit<Anthropic.CompletionCreateParams, 'prompt'>> = {}) {
    const completion = await this.api.completions.create({
      max_tokens_to_sample,
      model,
      prompt: `${Anthropic.HUMAN_PROMPT} ${prompt}${Anthropic.AI_PROMPT}`,
    });
    return completion.completion;
  }
  
}