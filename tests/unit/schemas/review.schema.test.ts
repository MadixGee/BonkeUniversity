import { describe, expect, it } from 'vitest';
import { ReviewSchema } from '../../../src/schemas/review.schema.js';

describe('ReviewSchema', () => {
  it('accepts a valid review payload', () => {
    const result = ReviewSchema.safeParse({
      architecture: 80,
      codeQuality: 70,
      testing: 90,
      documentation: 60,
      reflection: 85,
      engineeringJudgment: 75,
      notes: 'Great work',
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed review payloads', () => {
    const result = ReviewSchema.safeParse({ architecture: 101, codeQuality: 70, testing: 90, documentation: 60, reflection: 85, engineeringJudgment: 75, notes: '' });
    expect(result.success).toBe(false);
  });
});
