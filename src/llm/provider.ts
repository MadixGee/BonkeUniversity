import { z } from 'zod';

export interface WeekPromptVars {
  weekId: string;
  topic: string;
  weekNumber: string | number;
  totalWeeks: string | number;
  previousTopics?: string[];
  learnerContext?: string;
  courseGoal?: string;
  agentName?: string;
}

export interface LLMProvider {
  generate<T>(prompt: WeekPromptVars, schema: z.ZodType<T>): Promise<T>;
}
