import { z } from 'zod';

export interface LLMProvider {
  generate<T>(prompt: string, schema: z.ZodType<T>): Promise<T>;
}
