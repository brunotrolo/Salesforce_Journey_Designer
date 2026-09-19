---
name: fsc-status
description: Show where every capability stands across the SDD pipeline — what is specified, prototyped, ready to build, and what is blocked.
argument-hint: "[domain]"
arguments: [domain]
disable-model-invocation: true
---

# Pipeline status

Report where the work actually stands. If `$domain` was given, scope the report to that
domain; otherwise cover all of them.

Read, in this order:

1. `docs/sdd/BACKLOG.md` — the declared status of each capability.
2. `docs/sdd/DOMAINS.md` — which domains exist, so a domain with no capabilities still shows.
3. The `specs/<domain>/<NNN>-<slug>/` folders themselves — which artifacts are actually on
   disk (`spec.md`, `plan.md`, `tasks.md`, `architecture.md`, `prototype/`).

**Report what you find, not what the backlog claims.** If a capability's declared status and
its files disagree — marked ready to build with no `tasks.md`, or a prototype folder that the
backlog never mentions — that disagreement is the most useful thing in the report. Say it
plainly and propose the correction; do not quietly trust either side.

Answer in PT-BR, as a compact table (domain, capability, status, next step), followed by:
every open `[NEEDS CLARIFICATION]`, anything blocked and on what, and the single capability
you would pick up next, with the reason.

Read only — this command never edits the backlog or any spec.
