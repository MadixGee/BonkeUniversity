import { z } from 'zod';
import { config } from '../config.js';
import type { LLMProvider } from './provider.js';

export class OpenAIProvider implements LLMProvider {
  constructor(private readonly apiKey = config.openaiApiKey) {}

  async generate<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is required to use the OpenAI provider.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Return valid JSON matching the requested schema.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(content);
    return schema.parse(parsed);
  }
}
