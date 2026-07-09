import { z } from 'zod';

export const ReviewSchema = z.object({
  architecture: z.number().min(0).max(100),
  codeQuality: z.number().min(0).max(100),
  testing: z.number().min(0).max(100),
  documentation: z.number().min(0).max(100),
  reflection: z.number().min(0).max(100),
  engineeringJudgment: z.number().min(0).max(100),
  notes: z.string().min(1),
});

export type Review = z.infer<typeof ReviewSchema>;
