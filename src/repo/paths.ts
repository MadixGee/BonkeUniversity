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
