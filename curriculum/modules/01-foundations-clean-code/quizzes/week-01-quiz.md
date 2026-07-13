# Module 01 · Week 1 — Quiz
*Reasoning, not recall (Charter #1). There are no one-word answers; every question asks you to justify.*

## Questions
1. **Naming.** Here are two names for the same variable: `list` and `unshippedOrders`. Beyond "it's more descriptive," explain in terms of *reader cost* why the second is better — and give one case where an over-long name would actually be *worse*.

2. **Functions.** You're told "keep functions small." A colleague extracts a 5-line linear function into six one-line functions. Is that better or worse? Defend your answer using cohesion and reader experience — not a rule.

3. **Cohesion & coupling.** Explain why "things that change together should live together" is the *same* idea whether you're grouping lines into a function or services into a system. Give a concrete example at each scale.

4. **Refactoring.** Why is it *not refactoring* to "clean up the code and fix that bug at the same time"? What does mixing the two cost you when something breaks?

5. **Testing (trade-off).** The test pyramid says prefer many unit tests over many end-to-end tests. State the reasoning, then give a specific situation where you'd *deviate* and lean more on higher-level tests. (Hint: Fowler himself names an exception.)

6. **Trade-off (Charter #4).** You find two 8-line blocks that look nearly identical. Give one scenario where you should DRY them into one function, and one where you should *leave the duplication* — and state the principle that distinguishes the two.

7. **Using AI (Charter #6).** An assistant proposes replacing your discount `if/else` with a lookup table. List the two questions you must answer before accepting it, and explain why accepting it *without* answering them would violate the university's charter.

---
## Grading notes (for the Grader — not shown to the learner before submission)
Score each answer against `config/rubrics/quiz-and-assignment.md`. Award the top band only when the learner:
- Grounds the answer in **reader/change cost or first principles**, not restated rules (Q1–Q4).
- **Names a real trade-off and justifies what is given up** (Q5, Q6 explicitly; credit it anywhere it appears).
- Q5 exception: high-level tests that are *fast, reliable, and cheap to modify* can reduce the need for lower-level tests (Fowler, Test Pyramid bliki).
- Q6 distinguishing principle: DRY when the blocks change *for the same reason*; keep duplication when they merely *look* alike but change for different reasons (false abstraction couples them).
- Q7: acceptable answers include "does it preserve behavior (do my tests still pass)?" and "is it actually clearer / would I have chosen it, and what did it trade away?" Violation = accepting a change you cannot defend = outsourcing judgment.
- Deduct for confident answers with no reasoning, even if the conclusion is "correct."
