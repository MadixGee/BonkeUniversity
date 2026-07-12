import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  schemaName: string;
}

export interface Agent {
  systemPrompt: string;
  userPromptTemplate: string;
  config: AgentConfig;
}

const AGENTS_DIR = join(process.cwd(), 'src', 'agents');

export function loadAgent(agentName: string): Agent {
  const dir = join(AGENTS_DIR, agentName);

  const systemPrompt = readFileSync(join(dir, 'system.md'), 'utf-8').trim();
  const userPromptTemplate = readFileSync(join(dir, 'user.md'), 'utf-8').trim();
  const config: AgentConfig = JSON.parse(readFileSync(join(dir, 'config.json'), 'utf-8'));

  return { systemPrompt, userPromptTemplate, config };
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in vars)) {
      throw new Error(`Missing template variable "${key}" required by agent prompt template.`);
    }
    return vars[key];
  });
}