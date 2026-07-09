import { z } from 'zod';

export const TranscriptEntrySchema = z.object({
  weekId: z.string().min(1),
  date: z.string().min(1),
  topic: z.string().min(1),
  scores: z.object({
    architecture: z.number().min(0).max(100),
    codeQuality: z.number().min(0).max(100),
    testing: z.number().min(0).max(100),
    documentation: z.number().min(0).max(100),
    reflection: z.number().min(0).max(100),
    engineeringJudgment: z.number().min(0).max(100),
  }),
  weightedTotal: z.number().min(0).max(100),
  isCapstone: z.boolean().default(false),
  notes: z.string().optional(),
});

export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;
