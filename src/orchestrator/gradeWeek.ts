import { appendFile, existsSync, mkdir, readFile, writeFile } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import type { LLMProvider } from '../llm/provider.js';
import type { GitClientLike } from '../repo/gitClient.js';
import { getTranscriptPath } from '../repo/paths.js';
import { ReviewSchema } from '../schemas/review.schema.js';
import { TranscriptEntrySchema } from '../schemas/transcriptEntry.schema.js';

const mkdirAsync = promisify(mkdir);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const appendFileAsync = promisify(appendFile);

export interface GradeWeekOptions {
  repoRoot: string;
  provider: LLMProvider;
  git: GitClientLike;
  now?: Date;
  rubricWeights?: Record<string, number>;
}

export async function gradeWeek({ repoRoot, provider, git, now = new Date(), rubricWeights }: GradeWeekOptions) {
  const weekId = await resolveWeekId(repoRoot, now);
  const transcriptPath = getTranscriptPath(repoRoot);
  const weeklyDir = join(repoRoot, 'weekly', weekId);
  const reviewPath = join(weeklyDir, 'review.json');
  const gradingReportPath = join(weeklyDir, 'grading-report.md');

  if (existsSync(reviewPath)) {
    return { skipped: true, weekId };
  }

  await mkdirAsync(weeklyDir, { recursive: true });

  const reviewPayload = await provider.generate(`Review the week's work for ${weekId}.`, ReviewSchema);
  const weights = rubricWeights ?? {
    architecture: 1,
    codeQuality: 1,
    testing: 1,
    documentation: 1,
    reflection: 1,
    engineeringJudgment: 1,
  };
  const weightedTotal = calculateWeightedTotal(reviewPayload, weights);

  const transcriptEntry = TranscriptEntrySchema.parse({
    weekId,
    date: now.toISOString(),
    topic: 'Week topic',
    scores: {
      architecture: reviewPayload.architecture,
      codeQuality: reviewPayload.codeQuality,
      testing: reviewPayload.testing,
      documentation: reviewPayload.documentation,
      reflection: reviewPayload.reflection,
      engineeringJudgment: reviewPayload.engineeringJudgment,
    },
    weightedTotal,
    isCapstone: false,
    notes: reviewPayload.notes,
  });

  await writeFileAsync(reviewPath, JSON.stringify(reviewPayload, null, 2), 'utf8');
  await writeFileAsync(gradingReportPath, `# Grading Report\n\nWeighted total: ${weightedTotal}`, 'utf8');
  await appendFileAsync(transcriptPath, `${JSON.stringify(transcriptEntry)}\n`, 'utf8');

  await git.add([reviewPath, gradingReportPath, transcriptPath]);
  await git.commit(`feat(week): grade ${weekId}`);
  await git.push();

  return { skipped: false, weekId, weightedTotal };
}

async function resolveWeekId(repoRoot: string, now: Date): Promise<string> {
  const planPath = join(repoRoot, 'curriculum', 'plan.yaml');
  try {
    const contents = await readFileAsync(planPath, 'utf8');
    const parsed = yaml.load(contents) as { weeks?: Array<{ weekId?: string }> };
    const firstWeek = parsed.weeks?.[0]?.weekId;
    if (firstWeek) {
      return firstWeek;
    }
  } catch {
    // Fall back to a simple date-based week id.
  }

  const year = now.getUTCFullYear();
  const week = `${Math.ceil(now.getUTCDate() / 7)}`.padStart(2, '0');
  return `${year}-W${week}`;
}

function calculateWeightedTotal(scores: Record<string, number | string>, weights: Record<string, number>): number {
  const rubricKeys = [
    'architecture',
    'codeQuality',
    'testing',
    'documentation',
    'reflection',
    'engineeringJudgment',
  ] as const;

  const totalWeight = rubricKeys.reduce((acc, key) => acc + (weights[key] ?? 1), 0);
  const weightedSum = rubricKeys.reduce((acc, key) => {
    const value = scores[key];
    return acc + (typeof value === 'number' ? value : 0) * (weights[key] ?? 1);
  }, 0);

  return Number((weightedSum / totalWeight).toFixed(2));
}
