import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { config } from '../config.js';
import { loadAgent, renderTemplate } from './agentLoader.js';
import type { LLMProvider, WeekPromptVars } from './provider.js';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenAIProvider implements LLMProvider {
  constructor(private readonly apiKey = config.openRouterApiKey) {}

  async generate<T>(vars: WeekPromptVars, schema: z.ZodType<T>): Promise<T> {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required to use the OpenRouter provider.');
    }

    const agent = loadAgent(vars.agentName ?? 'curriculum-writer');
    const model = process.env.OPENROUTER_MODEL ?? agent.config.model;

    const supportsStructuredOutputs =
      model.includes('gpt-4o') ||
      model.includes('gpt-4.1') ||
      model.includes('o3') ||
      model.includes('claude-3.5') ||
      model.includes('claude-3.7');

    if (!supportsStructuredOutputs) {
      console.warn(`[OpenAIProvider] Model ${model} may not support json_schema structured outputs. Falling back to json_object.`);
    }

    const userPrompt = renderTemplate(agent.userPromptTemplate, buildTemplateVars(vars));

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.APP_URL ?? 'https://localhost',
        'X-Title': 'AI University',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: agent.systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: supportsStructuredOutputs
          ? {
              type: 'json_schema',
              json_schema: {
                name: agent.config.schemaName,
                schema: buildJsonSchema(schema, agent.config.schemaName),
                strict: true,
              },
            }
          : { type: 'json_object' },
        temperature: agent.config.temperature,
        max_tokens: agent.config.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`OpenRouter request failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = json.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new Error('OpenRouter returned empty content for the structured curriculum response.');
    }

    const parsed = parseModelContent(content);
    const aligned = alignValueToSchema(parsed, schema);
    const result = schema.safeParse(aligned);

    if (!result.success) {
      throw new Error(`Model output failed schema validation: ${result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join(', ')}`);
    }

    return result.data;
  }
}

function buildTemplateVars(vars: WeekPromptVars): Record<string, string> {
  const courseProgression = readCourseProgression();

  return {
    weekId: vars.weekId,
    topic: vars.topic,
    weekNumber: String(vars.weekNumber),
    totalWeeks: String(vars.totalWeeks),
    previousTopics: vars.previousTopics?.join(', ') || 'none',
    learnerContext: vars.learnerContext ?? 'self-paced learners with basic coding experience who benefit from practical, project-based exercises.',
    courseGoal: vars.courseGoal ?? 'build practical AI/software engineering fluency through project-based weekly modules.',
    courseProgression,
  };
}

function readCourseProgression(): string {
  const planPath = join(process.cwd(), 'curriculum', 'plan.yaml');
  try {
    const rawPlan = readFileSync(planPath, 'utf8');
    const parsed = yaml.load(rawPlan) as { weeks?: Array<{ topic?: string }> };
    const topics = (parsed.weeks ?? []).map((entry) => entry.topic).filter(Boolean).join(', ');
    return topics || 'none yet';
  } catch {
    return 'none yet';
  }
}

function buildJsonSchema(schema: z.ZodTypeAny, name: string): unknown {
  const converted = zodToJsonSchema(schema, { name });
  if (converted && typeof converted === 'object' && 'definitions' in converted) {
    const definition = (converted as { definitions?: Record<string, unknown> }).definitions?.[name];
    if (definition) {
      return definition;
    }
  }
  return converted;
}

function parseModelContent(content: string): unknown {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch?.[1] ?? trimmed;

  const jsonStart = candidate.indexOf('{');
  const jsonEnd = candidate.lastIndexOf('}');
  const jsonCandidate = jsonStart >= 0 && jsonEnd > jsonStart ? candidate.slice(jsonStart, jsonEnd + 1) : candidate;

  try {
    return JSON.parse(jsonCandidate);
  } catch {
    return {};
  }
}

function alignValueToSchema(value: unknown, schema: z.ZodTypeAny): unknown {
  const direct = schema.safeParse(value);
  if (direct.success) {
    return direct.data;
  }

  if (schema instanceof z.ZodDefault) {
    return alignValueToSchema(value, schema.removeDefault());
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const innerSchema = schema instanceof z.ZodOptional ? schema._def.innerType : schema._def.innerType;
    if (value === undefined || value === null) {
      return schema instanceof z.ZodNullable ? null : undefined;
    }
    return alignValueToSchema(value, innerSchema);
  }

  if (schema instanceof z.ZodString) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }

    if (value === undefined || value === null) {
      return 'TBD';
    }

    return String(value).trim() || 'TBD';
  }

  if (schema instanceof z.ZodNumber) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsedNumber = Number(value);
      if (Number.isFinite(parsedNumber)) {
        return parsedNumber;
      }
    }

    return 60;
  }

  if (schema instanceof z.ZodBoolean) {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }

    return false;
  }

  if (schema instanceof z.ZodArray) {
    if (Array.isArray(value)) {
      const aligned = value.map((entry) => alignValueToSchema(entry, schema.element));
      return padArrayToMinLength(aligned, schema);
    }

    if (value === undefined || value === null) {
      const seed = schema.element instanceof z.ZodObject
        ? [alignValueToSchema({}, schema.element)]
        : [alignValueToSchema(undefined, schema.element)];
      return padArrayToMinLength(seed, schema);
    }

    return padArrayToMinLength([alignValueToSchema(value, schema.element)], schema);
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
    const repaired: Record<string, unknown> = {};

    for (const [key, fieldSchema] of Object.entries(shape)) {
      repaired[key] = alignValueToSchema(source[key], fieldSchema as z.ZodTypeAny);
    }

    return repaired;
  }

  if (schema instanceof z.ZodEnum) {
    const values = schema.options as string[];
    if (typeof value === 'string' && values.includes(value)) {
      return value;
    }

    if (values.includes('textbook')) {
      return 'textbook';
    }

    return values[0];
  }

  if (schema instanceof z.ZodEffects) {
    return alignValueToSchema(value, schema._def.schema);
  }

  return value;
}

function padArrayToMinLength(items: unknown[], schema: z.ZodArray<any>): unknown[] {
  const minLength = schema._def.minLength?.value ?? 1;
  const result = [...items];

  while (result.length < minLength) {
    result.push(alignValueToSchema(undefined, schema.element));
  }

  return result;
}
