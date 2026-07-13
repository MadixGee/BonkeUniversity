import { describe, expect, it, vi } from 'vitest';
import { generateWeek } from '../../../src/orchestrator/generateWeek.js';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('generateWeek', () => {
  it('does not call the provider when the full lesson package already exists', async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'ai-university-'));
    const contentRepoRoot = mkdtempSync(join(tmpdir(), 'bonke-university-'));
    const moduleDir = join(contentRepoRoot, 'curriculum', 'modules', 'generate-a-compelling-weekly-topic');
    mkdirSync(join(moduleDir, 'lectures'), { recursive: true });
    mkdirSync(join(moduleDir, 'assignments'), { recursive: true });
    mkdirSync(join(moduleDir, 'quizzes'), { recursive: true });
    mkdirSync(join(repoRoot, 'curriculum'), { recursive: true });
    writeFileSync(join(repoRoot, 'curriculum', 'plan.yaml'), 'weeks:\n  - weekId: 2026-W29\n', 'utf8');
    writeFileSync(join(moduleDir, 'objectives.md'), '# objectives');
    writeFileSync(join(moduleDir, 'resources.md'), '# resources');
    writeFileSync(join(moduleDir, 'lectures', 'week-01-generate-a-compelling-weekly-topic.md'), '# lecture');
    writeFileSync(join(moduleDir, 'assignments', 'week-01-generate-a-compelling-weekly-topic.md'), '# assignment');
    writeFileSync(join(moduleDir, 'quizzes', 'week-01-generate-a-compelling-weekly-topic.md'), '# quiz');

    const provider = { generate: vi.fn() };

    const result = await generateWeek({
      repoRoot,
      provider,
      contentRepoPath: contentRepoRoot,
      now: new Date('2026-07-12'),
    });

    expect(result.skipped).toBe(true);
    expect(provider.generate).not.toHaveBeenCalled();
    expect(existsSync(join(moduleDir, 'assignments', 'week-01-generate-a-compelling-weekly-topic.md'))).toBe(true);
  });
});
