import { join } from 'node:path';

export function getWeekDir(repoRoot: string, weekId: string): string {
  return join(repoRoot, 'weekly', weekId);
}

export function getLLMLogsDir(repoRoot: string): string {
  return join(repoRoot, 'logs', 'llm-calls');
}

export function getTranscriptPath(repoRoot: string): string {
  return join(repoRoot, 'transcript', 'transcript.jsonl');
}

export function getContentRepoRoot(explicitPath?: string): string {
  const resolved = explicitPath ?? process.env.CONTENT_REPO_PATH;
  if (!resolved) {
    throw new Error('CONTENT_REPO_PATH is required. Point it to a separate BonkeUniversity clone path.');
  }

  return resolved;
}

export function getContentWeekDir(contentRepoRoot: string, weekId: string): string {
  return join(contentRepoRoot, 'weekly', weekId);
}
