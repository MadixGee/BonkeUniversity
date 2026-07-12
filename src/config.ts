import 'dotenv/config';

export const config = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY ?? '',
  openaiApiKey: process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY ?? '',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  smtpFrom: process.env.SMTP_FROM ?? 'ai-university@example.com',
  repoRemote: process.env.GITHUB_REMOTE ?? 'origin',
  githubRepo: process.env.GITHUB_REPO ?? 'https://github.com/MadixGee/BonkeUniversity.git',
};
