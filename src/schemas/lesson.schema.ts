import { z } from 'zod';

export const LessonSchema = z.object({
  topic: z.string().min(1),
  weekId: z.string().min(1),
  learningObjectives: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()),
  estimatedStudyTimeMinutes: z.number().int().positive(),
  whyThisMatters: z.string().min(1),
  readingList: z.array(
    z.object({
      title: z.string().min(1),
      url: z.string().url().optional(),
      sourceType: z.enum(['official-docs', 'university', 'textbook', 'talk', 'blog', 'community']),
    })
  ).min(1),
  practicalExamples: z.array(z.string()).min(1),
  architectureDiscussion: z.string().min(1),
  codingExercise: z.string().min(1),
  projectAssignment: z.string().min(1),
  reflectionQuestions: z.array(z.string()).min(1),
  citedClaims: z.array(
    z.object({
      claim: z.string().min(1),
      sourceUrl: z.string().url().nullable(),
    })
  ),
});

export type Lesson = z.infer<typeof LessonSchema>;
