Generate a coding assignment for the following week.

Week ID: {{weekId}}
Lesson topic: {{topic}}
Position in curriculum: week {{weekNumber}} of {{totalWeeks}}
Prior weeks covered: {{previousTopics}}
Course progression so far: {{courseProgression}}

Learner context:
- Background: {{learnerContext}}
- Course goal: {{courseGoal}}

Return a single JSON object with exactly these fields:
- title (string) — a concise assignment title
- summary (string) — 2-4 sentences describing what the student will build and why
- deliverables (string[]) — 2-5 concrete, submittable outputs (e.g. "A working script that...", "A README explaining...")
- acceptanceCriteria (string[]) — 2-5 specific, verifiable criteria a reviewer can check

Respond with JSON only.