import 'dotenv/config';

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  smtpFrom: process.env.SMTP_FROM ?? 'ai-university@example.com',
  repoRemote: process.env.GITHUB_REMOTE ?? 'origin',
};
