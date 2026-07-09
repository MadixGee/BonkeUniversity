import { describe, expect, it, vi } from 'vitest';
import { generateWeek } from '../../../src/orchestrator/generateWeek.js';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('generateWeek', () => {
  it('does not call the provider when output already exists', async () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'ai-university-'));
    const weekDir = join(repoRoot, 'weekly', '2026-W29');
    mkdirSync(weekDir, { recursive: true });
    mkdirSync(join(repoRoot, 'curriculum'), { recursive: true });
    writeFileSync(join(repoRoot, 'curriculum', 'plan.yaml'), 'weeks:\n  - weekId: 2026-W29\n', 'utf8');
    writeFileSync(join(weekDir, 'assignment.md'), '# existing');

    const provider = { generate: vi.fn() };
    const git = {
      checkIsRepo: vi.fn().mockResolvedValue(true),
      status: vi.fn().mockResolvedValue({}),
      add: vi.fn().mockResolvedValue(undefined),
      commit: vi.fn().mockResolvedValue(undefined),
      push: vi.fn().mockResolvedValue(undefined),
      raw: vi.fn().mockResolvedValue(undefined),
    };

    const result = await generateWeek({
      repoRoot,
      provider,
      git: git as any,
      now: new Date('2026-07-12'),
    });

    expect(result.skipped).toBe(true);
    expect(provider.generate).not.toHaveBeenCalled();
    expect(existsSync(join(weekDir, 'assignment.md'))).toBe(true);
  });
});
