# Rubric — Code & Architecture Review (used by Reviewer)

The Reviewer runs in two modes. A build must PASS to unlock the next module (Charter #5).
Verdict = **PASS** only when no criterion is below 2 **and** Architecture Trade-offs is ≥ 3.

## Code mode (mid model)
| Criterion | 0 | 2 | 4 |
|---|---|---|---|
| Correctness & behavior | doesn't work | works with gaps | correct, handles edges |
| Readability / clean code | hard to follow | mostly clear | intention-revealing, well-named |
| Structure & cohesion | tangled | reasonable | clear boundaries, low coupling |
| Tests | none | happy-path only | meaningful, covers edges/failure |
| Error handling & robustness | ignores failure | partial | deliberate, fails safely |

## Architecture mode (top model)
| Criterion | 0 | 2 | 4 |
|---|---|---|---|
| Design fit for the problem | mismatched | adequate | well-justified for requirements |
| **Trade-offs articulated** (Charter #4) | none | names alternatives | names alternatives AND justifies choice, states what was given up |
| Scalability / failure thinking | absent | mentioned | reasoned about load, failure, data growth |
| Simplicity | over-engineered or naive | ok | as simple as possible, no simpler |

## Reviewer conduct (Charter #6)
- Socratic first: point at the gap, ask the guiding question, let the learner fix it.
- Do not rewrite the learner's code for them. Suggest direction, not finished solutions.
- Tie every comment to a principle or a concrete failure mode, not taste.
- End with: verdict (PASS / NEEDS_WORK) + the 1–3 highest-leverage improvements.
