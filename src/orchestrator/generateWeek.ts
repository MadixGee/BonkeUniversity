import { mkdir, readFile, writeFile, existsSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import type { LLMProvider } from '../llm/provider.js';
import type { GitClientLike } from '../repo/gitClient.js';
import { getWeekDir } from '../repo/paths.js';
import type { Lesson } from '../schemas/lesson.schema.js';
import { LessonSchema } from '../schemas/lesson.schema.js';
import { AssignmentSchema } from '../schemas/assignment.schema.js';
import { QuizSchema } from '../schemas/quiz.schema.js';

const mkdirAsync = promisify(mkdir);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export interface GenerateWeekOptions {
  repoRoot: string;
  provider: LLMProvider;
  git: GitClientLike;
  now?: Date;
}

export async function generateWeek({ repoRoot, provider, git, now = new Date() }: GenerateWeekOptions) {
  const weekId = await resolveWeekId(repoRoot, now);
  const weekDir = getWeekDir(repoRoot, weekId);
  const lessonPath = join(weekDir, 'lecture.md');
  const assignmentPath = join(weekDir, 'assignment.md');
  const quizPath = join(weekDir, 'quiz.md');

  if (existsSync(lessonPath) || existsSync(assignmentPath) || existsSync(quizPath)) {
    return { skipped: true, weekId };
  }

  await mkdirAsync(weekDir, { recursive: true });

  const lessonPayload = await provider.generate<Lesson>(`Generate a lesson plan for week ${weekId}.`, LessonSchema);
  const assignmentPayload = await provider.generate(`Generate a coding assignment for ${lessonPayload.topic}.`, AssignmentSchema);
  const quizPayload = await provider.generate(`Generate a quiz for ${lessonPayload.topic}.`, QuizSchema);

  const lessonMarkdown = renderLessonMarkdown(lessonPayload);
  const assignmentMarkdown = renderAssignmentMarkdown(assignmentPayload);
  const quizMarkdown = renderQuizMarkdown(quizPayload);

  await writeFileAsync(lessonPath, lessonMarkdown, 'utf8');
  await writeFileAsync(assignmentPath, assignmentMarkdown, 'utf8');
  await writeFileAsync(quizPath, quizMarkdown, 'utf8');

  await writeFileAsync(join(weekDir, 'plan.json'), JSON.stringify({ weekId, topic: lessonPayload.topic }, null, 2), 'utf8');
  await writeFileAsync(join(weekDir, 'reading-list.md'), `# Reading List\n\n- ${lessonPayload.readingList.map((item) => item.title).join('\n- ')}`, 'utf8');

  await git.add([lessonPath, assignmentPath, quizPath, join(weekDir, 'plan.json'), join(weekDir, 'reading-list.md')]);
  await git.commit(`feat(week): generate ${weekId} — ${lessonPayload.topic}`);
  await git.push();

  return { skipped: false, weekId };
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

function renderLessonMarkdown(lesson: Lesson): string {
  return `# ${lesson.topic}\n\n## Learning Objectives\n- ${lesson.learningObjectives.join('\n- ')}\n\n## Why This Matters\n${lesson.whyThisMatters}\n`;
}

function renderAssignmentMarkdown(assignment: { title: string; summary: string; deliverables: string[]; acceptanceCriteria: string[] }) {
  return `# ${assignment.title}\n\n${assignment.summary}\n\n## Deliverables\n- ${assignment.deliverables.join('\n- ')}\n\n## Acceptance Criteria\n- ${assignment.acceptanceCriteria.join('\n- ')}`;
}

function renderQuizMarkdown(quiz: { title: string; questions: Array<{ prompt: string; options: string[]; answer: string }> }) {
  return `# ${quiz.title}\n\n${quiz.questions.map((question, index) => `${index + 1}. ${question.prompt}\n   - ${question.options.join('\n   - ')}\n   Answer: ${question.answer}`).join('\n\n')}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const repoRoot = process.cwd();
  const provider = { generate: async (_prompt: string, schema: any) => schema.parse({}) } as LLMProvider;
  const git = {
    checkIsRepo: async () => true,
    status: async () => ({}),
    add: async () => undefined,
    commit: async () => undefined,
    push: async () => undefined,
    resetHard: async () => undefined,
  };
  void generateWeek({ repoRoot, provider, git });
}
