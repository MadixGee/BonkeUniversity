Generate curriculum content for the following week.

Week ID: {{weekId}}
Topic: {{topic}}
Position in curriculum: week {{weekNumber}} of {{totalWeeks}}
Prior weeks covered: {{previousTopics}}
Course progression so far: {{courseProgression}}

Learner context:
- Background: {{learnerContext}}
- Goal of the overall course: {{courseGoal}}

Research workflow requirements (mandatory):
1. Before writing lecture content, identify 4-6 candidate primary sources for this topic.
2. Use only verifiable sources with real URLs/citations; exclude unverifiable sources.
3. Ground every factual claim in whyThisMatters, architectureDiscussion, and citedClaims in vetted sources.
4. Prefer official docs, peer-reviewed papers, well-established textbooks, or maintainer/creator statements.
5. If research tools are available, use them to verify authenticity and version-specific details.
6. If uncertain about any fact/source, flag uncertainty rather than presenting a guess as verified fact.

Return a single JSON object with exactly these fields:
- topic (string)
- weekId (string)
- learningObjectives (string[]) — 4-6 specific, measurable objectives
- prerequisites (string[]) — concepts/skills the learner should already have
- estimatedStudyTimeMinutes (number)
- whyThisMatters (string) — 2-4 sentences connecting this week to real-world relevance
- readingList (array of objects with "title", "url" or "source", and "why") — 3-5 items
- practicalExamples (string[]) — concrete worked examples or scenarios
- architectureDiscussion (string) — how this topic fits into a real system's architecture
- codingExercise (string) — a specific, self-contained coding task with clear requirements
- projectAssignment (string) — a larger deliverable that builds on the exercise
- reflectionQuestions (string[]) — 3-5 questions prompting deeper thinking
- citedClaims (array of objects with "claim" and "source") — factual claims made in this content, with real sources

Ensure resources.md can be generated from the same vetted source set with title, URL, and one-line rationale for each source used.

Respond with JSON only.