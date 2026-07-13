import { appendFile, existsSync, mkdirSync, readFile, readFileSync, writeFile } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
import { config } from '../config.js';
import { OpenAIProvider } from '../llm/openaiProvider.js';
import type { LLMProvider, WeekPromptVars } from '../llm/provider.js';
import { getContentRepoRoot } from '../repo/paths.js';
import type { Lesson } from '../schemas/lesson.schema.js';
import { LessonSchema } from '../schemas/lesson.schema.js';
import { AssignmentSchema } from '../schemas/assignment.schema.js';
import { QuizSchema } from '../schemas/quiz.schema.js';
import { writeAndPushWeek } from './pushWeekToContentRepo.js';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const appendFileAsync = promisify(appendFile);

export interface GenerateWeekOptions {
  repoRoot: string;
  provider: LLMProvider;
  contentRepoPath?: string;
  now?: Date;
}

export async function generateWeek({ repoRoot, provider, contentRepoPath, now = new Date() }: GenerateWeekOptions) {
  const resolvedContentRepoPath = getContentRepoRoot(contentRepoPath);
  if (!existsSync(resolvedContentRepoPath)) {
    throw new Error(`CONTENT_REPO_PATH does not exist on disk: ${resolvedContentRepoPath}`);
  }

  const weekId = await resolveWeekId(repoRoot, now);

  const weekPrompt = buildWeekPromptVars({ repoRoot, weekId });
  const moduleSlug = slugify(weekPrompt.topic);
  const moduleDir = join(resolvedContentRepoPath, 'curriculum', 'modules', moduleSlug);
  const objectivesPath = join(moduleDir, 'objectives.md');
  const resourcesPath = join(moduleDir, 'resources.md');
  const lecturesDir = join(moduleDir, 'lectures');
  const assignmentsDir = join(moduleDir, 'assignments');
  const quizzesDir = join(moduleDir, 'quizzes');
  const weekFileStem = `week-${String(weekPrompt.weekNumber).padStart(2, '0')}-${moduleSlug}`;
  const lessonPath = join(lecturesDir, `${weekFileStem}.md`);
  const assignmentPath = join(assignmentsDir, `${weekFileStem}.md`);
  const quizPath = join(quizzesDir, `${weekFileStem}.md`);

  const hasCompleteLessonPackage =
    existsSync(objectivesPath) &&
    existsSync(resourcesPath) &&
    existsSync(lessonPath) &&
    existsSync(assignmentPath) &&
    existsSync(quizPath);

  if (hasCompleteLessonPackage) {
    return { skipped: true, weekId };
  }

  mkdirSync(lecturesDir, { recursive: true });
  mkdirSync(assignmentsDir, { recursive: true });
  mkdirSync(quizzesDir, { recursive: true });

  const lessonPayload = await provider.generate<Lesson>(
    { ...weekPrompt, agentName: 'lesson-writer' },
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
  const objectivesMarkdown = renderObjectivesMarkdown(lessonPayload);

  await writeFileAsync(objectivesPath, objectivesMarkdown, 'utf8');
  await writeFileAsync(lessonPath, lessonMarkdown, 'utf8');
  await writeFileAsync(assignmentPath, assignmentMarkdown, 'utf8');
  await writeFileAsync(quizPath, quizMarkdown, 'utf8');
  await writeFileAsync(resourcesPath, renderResourcesMarkdown(lessonPayload), 'utf8');

  const pushResult = await writeAndPushWeek({
    repoPath: resolvedContentRepoPath,
    weekId,
    moduleSlug,
    moduleTitle: lessonPayload.topic,
    moduleRelativePath: join('curriculum', 'modules', moduleSlug),
    remoteName: config.repoRemote,
    remoteUrl: config.githubRepo,
  });

  const tracePath = join(repoRoot, 'transcript', 'lesson-branches.log');
  await appendFileAsync(tracePath, `${new Date().toISOString()} ${pushResult.branchName} ${pushResult.mergeCommit}\n`, 'utf8');
  console.log(`[lesson-archive] branch=${pushResult.branchName} merge=${pushResult.mergeCommit}`);

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

function renderObjectivesMarkdown(lesson: Lesson): string {
  return [
    `# Module Objectives — ${lesson.topic}`,
    '',
    ...lesson.learningObjectives.map((objective, index) => `${index + 1}. ${objective}`),
  ].join('\n');
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
  const provider = config.openRouterApiKey ? new OpenAIProvider() : (() => { throw new Error('No LLM provider configured. Please set OPENROUTER_API_KEY in your environment.'); })();

  void (async () => {
    await generateWeek({
      repoRoot,
      provider,
      contentRepoPath: process.env.CONTENT_REPO_PATH,
    });
  })();
}
