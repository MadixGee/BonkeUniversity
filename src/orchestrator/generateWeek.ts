import { appendFile, mkdir, readFile, readFileSync, writeFile, existsSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import { config } from '../config.js';
import { OpenAIProvider } from '../llm/openaiProvider.js';
import type { LLMProvider, WeekPromptVars } from '../llm/provider.js';
import type { GitClientLike } from '../repo/gitClient.js';
import { getWeekDir } from '../repo/paths.js';
import type { Lesson } from '../schemas/lesson.schema.js';
import { LessonSchema } from '../schemas/lesson.schema.js';
import { AssignmentSchema } from '../schemas/assignment.schema.js';
import { QuizSchema } from '../schemas/quiz.schema.js';

const mkdirAsync = promisify(mkdir);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const appendFileAsync = promisify(appendFile);

export interface GenerateWeekOptions {
  repoRoot: string;
  provider: LLMProvider;
  git: GitClientLike;
  now?: Date;
}

export async function generateWeek({ repoRoot, provider, git, now = new Date() }: GenerateWeekOptions) {
  const status = await git.status();
  if (isWorkingTreeDirty(status)) {
    throw new Error('Refusing to generate lesson: working tree is dirty. Commit or stash your changes first.');
  }

  const weekId = await resolveWeekId(repoRoot, now);
  const weekDir = getWeekDir(repoRoot, weekId);
  const lessonPath = join(weekDir, 'lecture.md');
  const assignmentPath = join(weekDir, 'assignment.md');
  const quizPath = join(weekDir, 'quiz.md');
  const resourcesPath = join(weekDir, 'resources.md');

  const hasCompleteLessonPackage =
    existsSync(lessonPath) &&
    existsSync(assignmentPath) &&
    existsSync(quizPath) &&
    existsSync(resourcesPath);

  if (hasCompleteLessonPackage) {
    return { skipped: true, weekId };
  }

  await mkdirAsync(weekDir, { recursive: true });

  const weekPrompt = buildWeekPromptVars({ repoRoot, weekId });
  const lessonSlug = slugify(weekPrompt.topic);
  const branchName = `lesson/${weekId}-${lessonSlug}`;

  await git.checkout('main');
  await git.checkoutNewBranch(branchName, 'main');

  const lessonPayload = await provider.generate<Lesson>(
    { ...weekPrompt, agentName: 'curriculum-writer' },
    LessonSchema,
  );
  const assignmentPayload = await provider.generate(
    { ...weekPrompt, topic: lessonPayload.topic, agentName: 'assignment-writer' },
    AssignmentSchema,
  );
  const quizPayload = await provider.generate(
    { ...weekPrompt, topic: lessonPayload.topic, agentName: 'quiz-generator' },
    QuizSchema,
  );

  const lessonMarkdown = renderLessonMarkdown(lessonPayload);
  const assignmentMarkdown = renderAssignmentMarkdown(assignmentPayload);
  const quizMarkdown = renderQuizMarkdown(quizPayload);

  await writeFileAsync(lessonPath, lessonMarkdown, 'utf8');
  await writeFileAsync(assignmentPath, assignmentMarkdown, 'utf8');
  await writeFileAsync(quizPath, quizMarkdown, 'utf8');
  await writeFileAsync(resourcesPath, renderResourcesMarkdown(lessonPayload), 'utf8');

  await writeFileAsync(join(weekDir, 'plan.json'), JSON.stringify({ weekId, topic: lessonPayload.topic }, null, 2), 'utf8');
  await writeFileAsync(join(weekDir, 'reading-list.md'), `# Reading List\n\n- ${lessonPayload.readingList.map((item) => item.title).join('\n- ')}`, 'utf8');

  await git.add([lessonPath, assignmentPath, quizPath, resourcesPath, join(weekDir, 'plan.json'), join(weekDir, 'reading-list.md')]);
  await git.commit(`Generate lesson: ${weekId} - ${lessonPayload.topic}`);

  await git.checkout('main');
  await git.mergeNoFf(branchName, `Merge ${branchName}`);
  const mergeCommit = await git.revParse('HEAD');

  if (config.githubRepo) {
    await git.setRemote?.(config.repoRemote, config.githubRepo);
  }

  await git.pushBranch(branchName, config.repoRemote);
  await git.pushBranch('main', config.repoRemote);

  const tracePath = join(repoRoot, 'transcript', 'lesson-branches.log');
  await appendFileAsync(tracePath, `${new Date().toISOString()} ${branchName} ${mergeCommit}\n`, 'utf8');
  console.log(`[lesson-archive] branch=${branchName} merge=${mergeCommit}`);

  return { skipped: false, weekId };
}

function isWorkingTreeDirty(status: unknown): boolean {
  if (!status || typeof status !== 'object') {
    return false;
  }

  const value = status as { isClean?: () => boolean; files?: unknown[] };
  if (typeof value.isClean === 'function') {
    return !value.isClean();
  }

  return Array.isArray(value.files) && value.files.length > 0;
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

function buildWeekPromptVars({ repoRoot, weekId }: { repoRoot: string; weekId: string }): WeekPromptVars {
  const planPath = join(repoRoot, 'curriculum', 'plan.yaml');
  try {
    const contents = readFileSync(planPath, 'utf8');
    const parsed = yaml.load(contents) as { weeks?: Array<{ weekId?: string; topic?: string }> };
    const weeks = parsed.weeks ?? [];
    const weekIndex = weeks.findIndex((entry) => entry.weekId === weekId);
    const currentWeek = weeks[weekIndex];
    const previousTopics = weeks.slice(0, Math.max(weekIndex, 0)).map((entry) => entry.topic).filter((topic): topic is string => Boolean(topic));
    const weekNumber = weekIndex >= 0 ? weekIndex + 1 : 1;
    const totalWeeks = weeks.length || 1;
    const learnerContext = 'self-paced learners with basic coding experience who benefit from practical, project-based exercises.';

    return {
      weekId,
      topic: currentWeek?.topic ?? 'Generate a compelling weekly topic',
      weekNumber,
      totalWeeks,
      previousTopics,
      learnerContext,
    };
  } catch {
    return {
      weekId,
      topic: 'Generate a compelling weekly topic',
      weekNumber: 1,
      totalWeeks: 1,
      previousTopics: [],
      learnerContext: 'self-paced learners with basic coding experience who benefit from practical, project-based exercises.',
    };
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
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

function renderResourcesMarkdown(lesson: Lesson): string {
  return [
    '# Resources',
    '',
    ...lesson.readingList.map((item) => `- ${item.title} | ${item.url ?? 'no-url-provided'} | selected for weekly topic grounding`),
  ].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const repoRoot = process.cwd();
  const provider = config.openRouterApiKey ? new OpenAIProvider() : createFallbackProvider();
  const git = {
    checkIsRepo: async () => true,
    status: async () => ({}),
    currentBranch: async () => 'main',
    checkout: async () => undefined,
    checkoutNewBranch: async () => undefined,
    mergeNoFf: async () => undefined,
    revParse: async () => 'HEAD',
    pushBranch: async () => undefined,
    add: async () => undefined,
    commit: async () => undefined,
    push: async () => undefined,
    resetHard: async () => undefined,
  };
  void generateWeek({ repoRoot, provider, git });
}

// function createFallbackProvider(): LLMProvider {
//   return {
//     async generate<T>(_prompt: WeekPromptVars, schema: any): Promise<T> {
//       if (schema === LessonSchema) {
//         return schema.parse({
//           topic: 'Systems Programming',
//           weekId: '2026-W29',
//           learningObjectives: ['Understand process isolation'],
//           prerequisites: ['Basic command line usage'],
//           estimatedStudyTimeMinutes: 90,
//           whyThisMatters: 'It helps you reason about how software interacts with the OS.',
//           readingList: [{ title: 'The Linux Programming Interface', sourceType: 'textbook' }],
//           practicalExamples: ['Tracing with strace'],
//           architectureDiscussion: 'Discuss how processes and threads differ.',
//           codingExercise: 'Write a small program that spawns a child process.',
//           projectAssignment: 'Document one OS interaction in your project.',
//           reflectionQuestions: ['What did you learn about process boundaries?'],
//           citedClaims: [{ claim: 'Processes are isolated memory spaces.', sourceUrl: 'https://man7.org/linux/man-pages/' }],
//         });
//       }

//       if (schema === AssignmentSchema) {
//         return schema.parse({
//           title: 'Build a small process demo',
//           summary: 'Create a small script or program that demonstrates fork and IPC.',
//           deliverables: ['Source code', 'Short README'],
//           acceptanceCriteria: ['The program runs locally', 'The README explains the behavior'],
//         });
//       }

//       if (schema === QuizSchema) {
//         return schema.parse({
//           title: 'Systems Programming Quiz',
//           questions: [
//             {
//               prompt: 'What is a process?',
//               options: ['An executing program instance', 'A compiler flag', 'A disk partition', 'A function'],
//               answer: 'An executing program instance',
//             },
//           ],
//         });
//       }

//       return schema.parse({});
//     },
//   };
// }
