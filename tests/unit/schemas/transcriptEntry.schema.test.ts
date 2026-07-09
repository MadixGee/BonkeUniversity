import { describe, expect, it } from 'vitest';
import { TranscriptEntrySchema } from '../../../src/schemas/transcriptEntry.schema.js';

describe('TranscriptEntrySchema', () => {
  it('accepts a valid transcript entry', () => {
    const result = TranscriptEntrySchema.safeParse({
      weekId: '2026-W29',
      date: '2026-07-10',
      topic: 'Distributed systems',
      scores: {
        architecture: 80,
        codeQuality: 70,
        testing: 90,
        documentation: 60,
        reflection: 85,
        engineeringJudgment: 75,
      },
      weightedTotal: 77.5,
      isCapstone: false,
      notes: 'Nice work',
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed transcript entries', () => {
    const result = TranscriptEntrySchema.safeParse({
      weekId: '2026-W29',
      date: '2026-07-10',
      topic: 'Distributed systems',
      scores: {
        architecture: 80,
        codeQuality: 70,
        testing: 90,
        documentation: 60,
        reflection: 85,
        engineeringJudgment: 75,
      },
      weightedTotal: 101,
      isCapstone: false,
    });

    expect(result.success).toBe(false);
  });
});
