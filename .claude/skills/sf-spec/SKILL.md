---
name: sf-spec
description: Start, resume or finish the SDD cycle for one capability — spec, UX, prototype and technical plan — through sf-sdd-orchestrator.
argument-hint: <domain> <capability>
arguments: [domain, capability]
---

# Design a capability

Run the SDD cycle for the capability **`$capability`** in domain **`$domain`**.

Run the procedure in `.claude/agents/sf-sdd-orchestrator.md` yourself, in the main
conversation: read it first and follow it step by step. It owns the sequence (spec writer →
UX designer → prototyper → tech planner) and the gates between the steps. Subagents cannot
launch other subagents or ask the user questions, so the orchestration stays here and you
dispatch each specialist with the Agent tool. Do not write spec, plan or prototype
yourself — that is the specialists' job.

Before dispatching, resolve what the user actually named:

- If `$domain` or `$capability` is missing or ambiguous, list the candidates from
  `docs/sdd/DOMAINS.md` and `docs/sdd/BACKLOG.md` and ask which one, rather than guessing.
- If the capability already has artifacts, this is a resume, not a restart — the orchestrator
  picks up from the first incomplete step. Never overwrite a ratified artifact to start over.

When the orchestrator reports back, relay to the user, in PT-BR: which artifacts now exist,
which step is next, every open `[NEEDS CLARIFICATION]`, and — when a prototype was produced —
how to open it for business validation.
