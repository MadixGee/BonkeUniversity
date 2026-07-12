import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { OpenAIProvider } from '../../../src/llm/openaiProvider.js';
import { LessonSchema } from '../../../src/schemas/lesson.schema.js';

const weekVars = {
  weekId: '2026-W29',
  topic: 'Python Basics',
  weekNumber: 1,
  totalWeeks: 12,
  previousTopics: [],
  learnerContext: 'Intermediate software engineer',
  courseGoal: 'Build practical AI systems',
};

describe('OpenAIProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses structured JSON schema output for the request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: '{"ok":true}' } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider('test-key');
    const result = await provider.generate(weekVars, z.object({ ok: z.boolean() }));

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        }),
      }),
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe(process.env.OPENROUTER_MODEL ?? 'gpt-4o-2024-08-06');
    expect(body.messages[0].content).toContain('curriculum designer');
    expect(body.response_format).toMatchObject({
      type: 'json_schema',
      json_schema: {
        name: 'week',
        strict: true,
      },
    });
  });

  it('throws a clear error when the model returns empty content', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: '' } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider('test-key');
    await expect(provider.generate(weekVars, z.object({ ok: z.boolean() }))).rejects.toThrow('empty content');
  });

  it('repairs a partial response so it conforms to the lesson schema', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: '```json\n{"topic":"Python basics"}\n```' } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider('test-key');
    const result = await provider.generate(weekVars, LessonSchema);

    expect(result.topic).toBe('Python basics');
    expect(Array.isArray(result.learningObjectives)).toBe(true);
    expect(result.learningObjectives.length).toBeGreaterThan(0);
    expect(result.readingList[0].sourceType).toBe('textbook');
  });

  it('pads arrays to satisfy schema minimum lengths', async () => {
    const quizLikeSchema = z.object({
      title: z.string().min(1),
      questions: z.array(
        z.object({
          prompt: z.string().min(1),
          options: z.array(z.string()).min(2),
          answer: z.string().min(1),
        })
      ).min(1),
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: '{"title":"Quiz","questions":[{"prompt":"Q1","options":["A"],"answer":"A"}]}' } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider('test-key');
    const result = await provider.generate(weekVars, quizLikeSchema);

    expect(result.questions[0].options.length).toBeGreaterThanOrEqual(2);
  });
});
