# AI University

AI University is a minimal TypeScript-based weekly study system that generates lessons, assignments, quizzes, and grading reports from a git-backed repository.

## Required environment variables

Set the following variables before running the scripts:

- OPENROUTER_API_KEY
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- SMTP_FROM

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the required values.
3. Run `npm run week:generate` to generate a week's materials.
4. Run `npm run week:grade` to grade the current week and append a transcript entry.

## Render deployment

Render cron jobs are defined in `render.yaml`:

- Weekly generate runs on Sunday at 06:00.
- Weekly grade runs on Friday at 18:00.

Add the environment variables above in the Render service settings before deploying.

## Editing future topics

Edit the curriculum plan in `curriculum/plan.yaml` to change the topic ordering or pacing for future weeks.
