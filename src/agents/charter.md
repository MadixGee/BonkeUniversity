# LedgerCore — AI University Content Repo

This repository is the curriculum, constitution, and build history for **LedgerCore**, a production-grade ledger & payments platform used as the vehicle for a self-directed backend engineering & software architecture program.

Everything an agent needs to teach, grade, or review in this program is derived from one file: [`CHARTER.md`](#the-charter). Everything a learner needs to build is defined in [`curriculum.yaml`](#curriculum). This README is the map between the two.

---

## What this course is

This is a **20-week, project-based backend engineering program** built around a single question: *what does it actually take to build and run a real payments system?*

Instead of separate exercises for "learn SQL," "learn networking," "learn security," every topic is taught by extending the **same codebase** — LedgerCore, a ledger and payments platform with one non-negotiable invariant: money in always equals money out. Each week takes on a standard computer-science or software-engineering topic (data structures, networking, databases, distributed systems, security, observability, and so on) and asks the learner to apply it directly to LedgerCore — never in isolation, always against a system that already has real users, real data, and real failure modes to consider.

**Why a ledger?** A ledger is unforgiving. You can't fake correctness — either the balances reconcile or they don't, either the invariant holds under concurrent writes or it breaks. That makes it an honest teacher: shortcuts show up immediately as bugs, not just style complaints.

**The five phases:**
1. **Foundations** (W29–32) — data structures, networking, OS/concurrency: the raw materials underneath everything else.
2. **Data layer** (W33–35) — how the ledger actually stores and serves state: relational schemas, event sourcing, caching.
3. **Service architecture** (W36–40) — turning a working core into a real backend service: layering, middleware, APIs, tests, events.
4. **Distributed & production concerns** (W41–44) — the problems that only show up at scale: sharding, observability, security, performance.
5. **Architecture & delivery** (W45–48) — stepping back to the trade-offs of the whole system, shipping it through CI/CD, and handing it off like a real engineer would.

**Two things run through every week, by design (see the [Charter](#the-charter)):**
- Every topic is *applied* to LedgerCore, not just studied — no concept counts as learned until there's a reviewed artifact proving it.
- Every design decision is expected to name its trade-offs and the alternatives it didn't take — nothing ships as "the obvious way to do it."

**AI's role is deliberately narrow.** Agents in this program (Faculty, Grader, Registrar, Reviewer, Dean) scaffold, question, and critique — they never write the artifact the learner has to build and defend. A recurring "AI-code-review drill" even has the learner generate a competing solution with an AI assistant and critique it against the Charter, to keep that boundary sharp rather than theoretical.

**What you end up with:** not a certificate, but a working, production-shaped payments platform you built and can defend line-by-line — plus the ADRs, postmortems, and onboarding doc a real engineering org would expect to find next to it.

---

## How this repo works

```
.
├── CHARTER.md            # the constitution — injected into every agent's system prompt
├── curriculum.yaml        # the 20-week phased syllabus (weeks, topics, LedgerCore tasks)
├── ledgercore/             # the actual codebase the learner builds, week over week
│   ├── src/
│   └── tests/
├── adrs/                   # Architecture Decision Records (one per major trade-off)
├── reviews/                 # Reviewer transcripts — one per module gate
├── postmortems/             # incident write-ups from chaos/load-test weeks
└── docs/
    ├── onboarding.md        # capstone deliverable — kept current for the "next engineer"
    └── design-docs/
```

Every commit that touches `CHARTER.md` is a deliberate amendment (see [Amendment process](#amendment-process)) — not a routine edit. Every other file in the repo exists *because* the Charter's six principles require it: applied artifacts, reviewed builds, ADRs, and a versioned trail a new engineer could pick up cold.

---

## The Charter

> The constitution of the university. Version-controlled, injected into the system prompt of **every** agent. There is exactly one source of pedagogical truth, and this is it.

**Mission:** develop a world-class software engineer capable of designing, building, deploying, maintaining, and leading production software systems — and keep doing so as software engineering and AI themselves evolve.

### The Six Principles

| # | Principle | Gate? |
|---|---|---|
| 1 | Prefer understanding over memorization | |
| 2 | Every concept must be applied | 🔒 |
| 3 | Learn principles before frameworks | |
| 4 | Learn trade-offs | |
| 5 | Build before moving on | 🔒 |
| 6 | AI is an assistant, not a replacement for engineering judgment | |

### Enforcement (machinery, not vibes)

| Principle | Enforced by | Mechanism |
|---|---|---|
| 1 Understanding | Grader | rubric rewards reasoning, penalizes recall |
| 2 Applied 🔒 | Registrar | `concept.mastered` requires a reviewed artifact |
| 3 Principles-first | Curriculum Designer | prerequisite graph ordering |
| 4 Trade-offs | Grader + Reviewer | mandatory rubric criterion + arch-mode probing |
| 5 Build-first 🔒 | Dean + Reviewer | module unlock blocked until build PASSES |
| 6 AI-as-assistant | All agents + human | Socratic prompts; confirm-mode; learner is arbiter |

### Operating values
- The learner is the final arbiter — the system serves judgment, it does not replace it.
- Balance learning with work and health — pacing adapts to real availability and signals of strain.
- Honesty over flattery — real progress is celebrated, real gaps are named plainly and kindly.
- Everything is versioned — curriculum, config, reviews, and transcript live in Git.

**Full text:** [`CHARTER.md`](./CHARTER.md) is the canonical, unabridged source. This README summarizes it; the file itself is what agents load.

#### Amendment process
Amendments are commits to `CHARTER.md`, reviewed by the learner before merge. Agents pick up the change on their next run. Prefer few, deliberate amendments over frequent churn — a constitution should be stable.

---

## Curriculum

20 weeks, 5 phases, one running codebase. Every week ships a LedgerCore artifact that satisfies Principle 2 (applied) and Principle 5 (build-first gate) before the next module unlocks.

| Week | Phase | Topic | LedgerCore Task |
|---|---|---|---|
| W29 | 1 | Codebase orientation & improvement | Inspect codebase, document findings, ship one small quality improvement with tests |
| W30 | 1 | Data structures & algorithms | Balance-lookup data structure, benchmarked vs. naive log scan |
| W31 | 1 | Networking basics | Raw TCP echo server → minimal HTTP server exposing `POST /transfer` |
| W32 | 1 | OS concepts & concurrency | Concurrent transaction-posting worker pool; prove no race on the balance invariant |
| W33 | 2 | Databases & persistence | Accounts/transactions/entries schema, invariant enforced as a DB constraint |
| W34 | 2 | NoSQL & modern data stores | Event-sourced transaction history; ADR: relational vs. event-sourced |
| W35 | 2 | Caching & data access patterns | Read-through cache for balances; staleness handling vs. the immutable log |
| W36 | 3 | Backend service design | Hexagonal architecture — domain logic isolated from DB/HTTP adapters |
| W37 | 3 | Middleware & cross-cutting concerns | API Gateway middleware chain (auth, idempotency, rate limiting, errors) + AI-code-review drill |
| W38 | 3 | API design & contracts | Versioned OpenAPI spec for transfer/balance/history, wired through middleware |
| W39 | 3 | Testing backend systems | Full unit + integration suite, isolated middleware tests, test-strategy doc |
| W40 | 3 | Message queues & event-driven architecture | `TransactionPosted` events; Reconciliation + Notification consumers with DLQ |
| W41 | 4 | Distributed systems foundations | Consistent-hashing shards; cross-shard transfer handling |
| W42 | 4 | Reliability & observability | End-to-end tracing, SLOs, chaos test, incident postmortem |
| W43 | 4 | Security fundamentals | OAuth2 on the Gateway, OWASP self-audit, fix ≥2 findings |
| W44 | 4 | Scalability & performance | Load test `POST /transfer`, find and fix the real bottleneck, prove it with numbers |
| W45 | 5 | Software architecture patterns | ADR: modular monolith vs. microservices, rewritten for a non-technical audience |
| W46 | 5 | Cloud-native deployment & CI/CD | Containerize all services; CI runs the full invariant suite pre-merge |
| W47 | 5 | System design & trade-offs | Design doc: 10,000 transfers/sec, capacity estimates, rejected trade-offs |
| W48 | 5 | Capstone | Feature-complete LedgerCore, final architecture doc, full-system AI-review drill, onboarding doc |

The canonical, machine-readable version of this table lives in [`curriculum.yaml`](./curriculum.yaml) — agents read *that* file, not this README, so keep them in sync when the syllabus changes.

---

## For agents reading this repo

If you are an agent (Faculty, Grader, Registrar, Curriculum Designer, Reviewer, or Dean) operating in this repo:

1. Load `CHARTER.md` in full — it is your system prompt's source of truth, not this summary.
2. Load `curriculum.yaml` for the current week's task and its prerequisites.
3. Check `reviews/` and the Registrar's state before unlocking or grading anything — gates (🔒) are enforced in data, not by convention.
4. Never produce the artifact the learner is meant to build and defend. Scaffold, question, critique — Socratically.

## For the learner

You are the final arbiter. Every build you ship should be something you could defend line-by-line to a Reviewer — because you will be. Pace sustainably; the Charter means it about balance and honesty over flattery.

## Contributing / amending

- Curriculum tweaks (topics, tasks, ordering): PR against `curriculum.yaml`.
- Constitutional changes (the six principles, enforcement, operating values): PR against `CHARTER.md`, reviewed by the learner before merge, per the [Amendment process](#amendment-process) above.