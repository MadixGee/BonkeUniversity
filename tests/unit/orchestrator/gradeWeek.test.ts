import { describe, expect, it, vi } from 'vitest';
import { gradeWeek } from '../../../src/orchestrator/gradeWeek.js';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('gradeWeek', () => {
  it('computes the weighted total from rubric weights', async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'ai-university-'));
    const weeklyDir = join(repoRoot, 'weekly', '2026-W29');
    mkdirSync(weeklyDir, { recursive: true });
    mkdirSync(join(repoRoot, 'transcript'), { recursive: true });
    writeFileSync(join(repoRoot, 'transcript', 'transcript.jsonl'), '', 'utf8');

    const provider = {
      generate: vi.fn().mockResolvedValue({
        architecture: 80,
        codeQuality: 70,
        testing: 90,
        documentation: 60,
        reflection: 85,
        engineeringJudgment: 75,
        notes: 'Good week',
      }),
    };

    const git = {
      add: vi.fn().mockResolvedValue(undefined),
      commit: vi.fn().mockResolvedValue(undefined),
      push: vi.fn().mockResolvedValue(undefined),
    };

    const result = await gradeWeek({
      repoRoot,
      provider: provider as any,
      git: git as any,
      now: new Date('2026-07-10'),
      rubricWeights: {
        architecture: 1,
        codeQuality: 2,
        testing: 1,
        documentation: 1,
        reflection: 1,
        engineeringJudgment: 1,
      },
    });

    expect(result.weightedTotal).toBe(75.71);
  });
});
