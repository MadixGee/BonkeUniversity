# Degree Plan — The Multi-Year Learning Graph

> Owned by the Curriculum Designer. Sequenced **principles before frameworks** (Charter #3).
> This is a living document: it re-plans from the transcript. The sequence below is the V1 baseline.
> Each module requires a working, reviewed build before the next unlocks (Charter #5).

## Tracks (the five pillars of the north star)
1. **Foundations & Clean Code** — the bedrock of everything.
2. **Backend Engineering** — building real services.
3. **Distributed Systems** — correctness and coordination at scale.
4. **Cloud Engineering** — deploy, operate, observe, survive failure.
5. **AI Engineering** — building with models responsibly.

Interleaved throughout: **software architecture**, **trade-off reasoning**, and **leadership/decision-making** (toward *leading* systems, not just building them).

## Baseline module sequence (prerequisites in parentheses)

### Year 1 — Foundations → Backend
- **M01 Foundations & Clean Code** — naming, functions, cohesion/coupling, refactoring, testing basics, version control. *(none)*
- **M02 Language & Runtime Deep-Dive** — memory model, types, error handling, tooling. *(M01)*
- **M03 Data Structures & Complexity in Practice** — choosing structures by trade-off, not rote. *(M01)*
- **M04 HTTP & API Semantics** — request/response, idempotency, status codes, REST principles. *(M01)*
- **M05 Data Modeling & Databases** — relational modeling, indexing, transactions — *before* any ORM. *(M03, M04)*
- **M06 Backend Service (capstone build)** — a real service applying M04–M05. *(M04, M05)*

### Year 2 — Architecture & Distributed Systems
- **M07 Software Architecture Fundamentals** — boundaries, layering, dependency direction, trade-offs. *(M06)*
- **M08 Concurrency & Parallelism** — the model *before* framework async APIs. *(M02)*
- **M09 Messaging & Event-Driven Design** — queues, logs, delivery semantics. *(M07, M08)*
- **M10 Distributed Systems Core** — consistency, consensus, partitions, failure. *(M09)*
- **M11 Distributed Systems Capstone** — build a resilient multi-service system. *(M10)*

### Year 3 — Cloud & AI Engineering
- **M12 Cloud Fundamentals** — compute/storage/network primitives; IaC. *(M06)*
- **M13 Observability & Reliability** — logs/metrics/traces, SLOs, incident thinking. *(M11, M12)*
- **M14 Deployment & CI/CD** — pipelines, rollouts, rollback. *(M12)*
- **M15 AI Engineering Foundations** — LLM APIs, retrieval, evaluation, guardrails. *(M06)*
- **M16 AI Systems Capstone** — a production-grade AI-backed service. *(M13, M15)*

### Years 4–5+ — Mastery & Leadership
- System-design drills & mock interviews · leading technical decisions · architecture review of others' systems · deep specialization chosen from the transcript · portfolio + credentialing · continuous market-relevance refresh.

> Adaptation note: weak areas surface as extra applied work and spaced-repetition revisits; strengths accelerate. The Registrar's strengths/weaknesses feed every re-plan.
