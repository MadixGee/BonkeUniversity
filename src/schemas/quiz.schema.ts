import { z } from 'zod';

export const QuizSchema = z.object({
  title: z.string().min(1),
  questions: z.array(
    z.object({
      prompt: z.string().min(1),
      options: z.array(z.string()).min(2),
      answer: z.string().min(1),
    })
  ).min(1),
});

export type Quiz = z.infer<typeof QuizSchema>;
