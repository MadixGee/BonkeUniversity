import { describe, expect, it } from 'vitest';
import { LessonSchema } from '../../../src/schemas/lesson.schema.js';

describe('LessonSchema', () => {
  it('accepts a valid lesson payload', () => {
    const result = LessonSchema.safeParse({
      topic: 'Distributed systems',
      weekId: '2026-W29',
      learningObjectives: ['Understand replication'],
      prerequisites: ['Concurrency basics'],
      estimatedStudyTimeMinutes: 120,
      whyThisMatters: 'Important for resilient services',
      readingList: [{ title: 'The Raft paper', sourceType: 'official-docs' }],
      practicalExamples: ['Container orchestration'],
      architectureDiscussion: 'Discuss leader election',
      codingExercise: 'Build a tiny replicated service',
      projectAssignment: 'Document an architecture decision',
      reflectionQuestions: ['What trade-offs did you notice?'],
      citedClaims: [{ claim: 'Raft uses leader election', sourceUrl: 'https://raft.github.io/' }],
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed lesson payloads', () => {
    const result = LessonSchema.safeParse({
      topic: 'Distributed systems',
      weekId: '2026-W29',
      learningObjectives: [],
      prerequisites: [],
      estimatedStudyTimeMinutes: -1,
      whyThisMatters: '',
      readingList: [],
      practicalExamples: [],
      architectureDiscussion: 'ok',
      codingExercise: 'ok',
      projectAssignment: 'ok',
      reflectionQuestions: [],
      citedClaims: [],
    });

    expect(result.success).toBe(false);
  });
});
