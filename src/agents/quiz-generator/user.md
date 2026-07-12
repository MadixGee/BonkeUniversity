Generate a quiz for the following week.

Week ID: {{weekId}}
Lesson topic: {{topic}}
Position in curriculum: week {{weekNumber}} of {{totalWeeks}}
Prior weeks covered: {{previousTopics}}
Course progression so far: {{courseProgression}}

Learner context:
- Background: {{learnerContext}}
- Course goal: {{courseGoal}}

Return a single JSON object with exactly these fields:
- title (string) — a concise quiz title
- questions (array) — 3-5 questions, each with:
  - prompt (string) — the question text
  - options (string[]) — 3-4 answer choices
  - answer (string) — the correct answer, must be one of the options verbatim

Respond with JSON only.