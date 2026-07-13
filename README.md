# 🏛️ AI University

A self-evolving, agent-run university that develops one engineer into a **world-class software engineer** over 5–10 years. It plans a multi-year curriculum, teaches from *validated* sources, sets applied work, reviews your real GitHub builds and architecture decisions, grades you, tracks you across years, and adapts — all on a lean (< $50/mo) budget, running in the cloud even when your computer is off.

> Full design: see the **Architecture Design Document** (thread canvas). This repo is the system-of-record: versioned config, curriculum archive, and your project code.

## The Charter (the heart)
Six enforced principles — see [`charter.md`](charter.md). Two are hard gates the system physically enforces: **every concept must be applied** and **build before moving on** (the next module won't unlock until a real build passes review).

## The system (V2 target: 6 agents + 4 shared skills)
| Agent | Role | V1? |
|---|---|---|
| **Dean** | orchestrator, gatekeeper, delivery | ✅ active |
| **Faculty** | lecture + assignment + quiz (one coherent package) | ✅ active |
| **Reviewer** | code + architecture review; emits the PASS gate | ✅ active |
| Curriculum Designer | multi-year adaptive degree plan | V2 |
| Grader | grades submissions (separate from Faculty) | V2 |
| Registrar | transcript, strengths/weaknesses, gate state | V2 |

Shared skills: `source-validation`, `github-review`, `assessment/rubric`, `transcript-update`.

## Repository map
```
charter.md                     # constitution — injected into every agent
config/
  agents/                      # version-controlled mirror of each agent's prompt
  skills/                      # shared reusable workflows
  rubrics/                     # grading + review rubrics (trade-offs criterion mandatory)
  models.yaml                  # model tiering + hard budget caps (sum < $50)
  schedules.yaml               # cadence (V1 manual; V2 cloud cron)
curriculum/
  degree-plan.md               # the multi-year learning graph
  modules/01-foundations-clean-code/
    objectives.md              # what M01 teaches + its gate build
    lectures/ assignments/ quizzes/   # generated content lands here
    resources.md               # validated sources only
projects/                      # ★ YOUR BUILDS — what the Reviewer reads
reviews/                       # archived review reports
transcript/                    # human-readable mirror of the progress Tables
```

## V1 (MVP) — how to run it
V1 proves the loop end-to-end, **manually triggered**:
1. The **Dean** checks the gate and asks **Faculty** for Module 01's weekly package.
2. You study, then **build** the refactor in `projects/module-01-project/` and push.
3. The **Reviewer** reviews the build and returns a PASS / NEEDS_WORK verdict.
4. Only a PASS unlocks Module 02 (Charter #5).

**Exit criterion for V1:** the build-before-moving-on gate demonstrably blocks advancement until a real build passes.

## Getting this onto GitHub
```bash
cd ai-university
git init && git add . && git commit -m "Scaffold AI University (V1)"
# create a PRIVATE repo on GitHub, then:
git remote add origin git@github.com:<you>/ai-university.git
git branch -M main && git push -u origin main
```
Keep it **private**. Secrets never go in the repo — the platform injects credentials at runtime (see `.gitignore`).

## Roadmap
**V1** 3-agent manual loop → **V2** full 6-agent adaptive cloud system (scheduled, delivered, budget-capped) → **V3+** distributed systems / cloud / AI-eng depth, capstones, spaced repetition, portfolio, market-relevance checks.

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
