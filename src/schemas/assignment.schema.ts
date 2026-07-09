import { z } from 'zod';

export const AssignmentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  deliverables: z.array(z.string()).min(1),
  acceptanceCriteria: z.array(z.string()).min(1),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
