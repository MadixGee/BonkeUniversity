# Module 01 · Week 1 — Foundations & Clean Code
*Faculty lecture · aligned to `objectives.md` · governed by `charter.md`*

## Why this week matters (first principles)
You are not learning "clean code" because a book said so. You are learning it because of one economic fact: **software is read and changed far more often than it is written.** Over a system's life, the dominant cost is not typing the code — it's the next engineer (often future-you) *understanding* it well enough to change it safely. Every technique this week is a lever on that single cost. Keep asking *"does this make the code cheaper to change correctly?"* — that question is the whole subject.

> Charter #1: we're after *understanding*, not rules to memorize. For every guideline below, you should be able to state the underlying reason. If you can't, you don't own it yet.

## 1. Naming — the cheapest, highest-leverage tool
A name is a compression of intent. `d` forces the reader to reconstruct meaning; `daysUntilExpiry` hands it to them. The test: **could a new teammate guess what this holds/does without reading the implementation?**
- Reveal intent (`elapsedTimeMs`, not `t`).
- Avoid disinformation (`accountList` that isn't a list lies to the reader).
- Make distinctions meaningful (`getUser` vs `getUserData` vs `getUserInfo` — what's the difference? if you can't say, collapse them).

## 2. Functions — small, and doing one thing
The reason to keep functions small isn't aesthetics — it's that a function you can hold in your head entirely is a function you can reason about correctly. Signals a function does too much: you can't name it without "and"; it mixes levels of abstraction (high-level policy next to byte-twiddling); it has flag arguments that switch behavior.

## 3. Cohesion & coupling — the seed of all architecture
This is the most important idea of the week, because it scales all the way up to distributed systems.
- **Cohesion**: things that change together should live together.
- **Coupling**: things that change for different reasons should be able to change independently.
Every architectural pattern you'll learn later (modules, services, bounded contexts) is *this same idea at a larger radius.* Master it in the small now.

## 4. Refactoring under tests
**Refactoring** = changing the structure of code *without changing its observable behavior*, in small safe steps (Fowler). The discipline that makes it safe is the test harness: you change, you run tests, they stay green, you commit. Without tests you're not refactoring — you're gambling.

## 5. Testing basics — what tests are *for*
Tests exist to let you change code without fear. The shape matters: the **test pyramid** says write *many* fast, narrow **unit tests**, fewer coarse ones, very few slow end-to-end ones — because unit tests are fast, cheap, and reliable while broad tests are brittle and slow (Fowler). A good unit test pins one behavior and runs in milliseconds, so you can run them several times a minute and catch a regression the instant you cause it.

## 6. Version control discipline
A commit is a unit of *understanding* for the next reader (again: reader-cost). Small, coherent commits with honest messages make history a story someone can follow — and make `git bisect` able to find the commit that broke something. One giant "fixed stuff" commit throws that away.

---

## ⚖️ Trade-offs (mandatory — Charter #4)
Clean code is not a set of absolutes; it's a set of tensions you resolve *on purpose*:
1. **Small functions vs. jumping around.** Extracting everything into tiny functions can fragment a simple linear flow so the reader "pinballs" across the file. Extract when it names a concept or removes duplication — not reflexively.
2. **DRY vs. coupling.** Removing duplication couples the two call sites to a shared abstraction. If they only *look* similar but change for different reasons, forcing them together is worse than the duplication. (Prefer "duplicate until the abstraction is obvious.")
3. **Test coverage vs. speed of change.** Over-specifying behavior in tests can cement bad design and make refactoring painful. Test behavior, not implementation detail.
4. **Readability vs. performance.** Occasionally the clear version is measurably too slow. Then you optimize — *with a comment explaining why the ugly version exists*, and a test guarding the behavior.

You will be graded (and reviewed) on whether you can *name the alternative and justify what you gave up* — not on picking a "right" answer.

---

## How this connects to your build
Everything above is theory until you apply it (Charter #2). This week's assignment gives you a deliberately messy program. You'll put it under tests, then refactor it clean in small green steps, with a readable commit history. **The next module does not unlock until the Reviewer PASSES that build (Charter #5).**

## A note on using AI this week (Charter #6)
Use an AI assistant to *explain* a concept or *critique* your refactor — but **you** write the code and **you** make every naming and structural decision, and you must be able to defend it. If AI proposes a refactor, your job is to interrogate it: what did it trade away? Would you have chosen that? An engineer who can't evaluate the assistant's suggestion is not yet the engineer we're building.

## ✅ Validated sources (passed source-validation)
- **Martin Fowler — "The Practical Test Pyramid"** — https://martinfowler.com/articles/practical-test-pyramid.html *(authoritative; source-of-truth on test strategy)*
- **Martin Fowler — "Unit Test" (bliki)** — https://martinfowler.com/bliki/UnitTest.html
- **Martin Fowler — "Test Pyramid" (bliki)** — https://martinfowler.com/bliki/TestPyramid.html
- **Book — *Refactoring: Improving the Design of Existing Code*, Martin Fowler** *(canonical definition of refactoring)*
- **Book — *Clean Code*, Robert C. Martin** *(foundational on naming/functions; a few practices are debated — read critically, per Charter #6)*

> **Rejected by validation:** vendor/marketing pages returned for "refactoring" (product pitches, not authoritative). Not cited. This is the source-validation skill doing its job.
