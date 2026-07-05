# Shared Skills (reusable workflows — invoked by agents, not standalone runs)

| Skill | Used by | Purpose |
|---|---|---|
| source-validation | Curriculum, Faculty | search -> credibility filter -> recency -> cross-reference (>=2 sources) -> score -> store only validated sources |
| github-review | Reviewer | fetch repo/diff; run structured code/arch review checklist |
| assessment/rubric | Grader | apply rubric consistently; produce score + rationale |
| transcript-update | Registrar | idempotent writes to transcript tables + Memories |

Skills are configured on the platform (Learning -> Skills). This folder mirrors their definitions for version control.
