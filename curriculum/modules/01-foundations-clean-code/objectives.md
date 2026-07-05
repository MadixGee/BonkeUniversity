# Module 01 — Foundations & Clean Code

**Domain:** Foundations · **Order:** 1 · **Prerequisites:** none · **Status:** unlocked

## Why this module first (principle, not framework)
Everything downstream — services, distributed systems, cloud, AI — is written *as code that humans must keep changing for years*. Before any framework, you learn to write code that is correct, clear, and cheap to change. This is the bedrock the Charter is built on.

## Learning objectives (each requires an applied artifact — Charter #2)
1. **Naming & intention** — write intention-revealing names; explain *why* a name is good.
2. **Functions** — small, single-purpose, few arguments; recognize and fix long functions.
3. **Cohesion & coupling** — reason about what belongs together and what should be independent (the seed of architecture).
4. **Refactoring under tests** — change structure safely behind a test harness.
5. **Testing basics** — write meaningful tests (not just happy-path); understand what a test is *for*.
6. **Version control discipline** — small, coherent commits; readable history.
7. **Trade-offs (Charter #4)** — for one design choice in your build, articulate the alternatives and justify what you gave up.

## The applied build (the gate — Charter #5)
Take a small, deliberately messy program (provided or your own ~200-line script) and, **behind tests**, refactor it into clean, cohesive modules with a readable commit history. Push to `projects/module-01-project/`.

**Exit criterion:** the Reviewer PASSES the build (code mode) with the Trade-offs criterion ≥ 3. Only then does M02 unlock.

## Assessment
- **Quiz:** reasoning about naming, cohesion/coupling, and *why* a refactor is safe (understanding, not recall — Charter #1).
- **Assignment:** the refactor build above, graded against `config/rubrics/code-review.md`.
