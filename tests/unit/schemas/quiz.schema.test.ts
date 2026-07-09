import { describe, expect, it } from 'vitest';
import { QuizSchema } from '../../../src/schemas/quiz.schema.js';

describe('QuizSchema', () => {
  it('accepts a valid quiz payload', () => {
    const result = QuizSchema.safeParse({
      title: 'Quiz',
      questions: [{ prompt: 'What is a service?', options: ['A', 'B', 'C', 'D'], answer: 'A' }],
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed quiz payloads', () => {
    const result = QuizSchema.safeParse({ title: '', questions: [] });
    expect(result.success).toBe(false);
  });
});
