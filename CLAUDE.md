# CLAUDE.md

**This repository's rules live in [`AGENTS.md`](AGENTS.md). Read it before making any
change.** Single, vendor-neutral source — this file doesn't duplicate them, so they can't
drift apart.

The essentials, in three lines:

1. This repository **is a skill** that designs and prototypes — it **never deploys anything
   real**. No `force-app/` Apex, LWC or objects here; prototypes run on fixture data.
2. An unresolved question is a `[NEEDS CLARIFICATION]` marker, never a plausible guess. A
   wrong guess in a spec doesn't throw — it gets built for real downstream.
3. `docs/sdd/constitution.md` outranks every agent, plan and prototype. Don't reopen a
   decision it already fixed; propose the change to the user.

## Claude Code specifics

- **Subagents** (`.claude/agents/*.md`) use `name`, `description`, `tools`, optionally
  `model` and `memory`. This is **not** skill frontmatter: a `SKILL.md` uses
  `allowed-tools`. Swapping one for the other is silently ignored.
- **Agent memory:** `fsc-design-system-architect` declares `memory: project`, which
  auto-loads `.claude/agent-memory/fsc-design-system-architect/MEMORY.md`. That exact path
  is what the harness reads — a `MEMORY.md` anywhere else is never loaded. The directory
  appears when the agent first writes memory; its absence isn't a defect.
- **Rules auto-load.** `journey-designer.md` and `karpathy-guidelines.md` are
  unconditional; `prototipo.md` is scoped by `paths:`. Agents deliberately don't
  cross-reference them — the mechanism already delivers them.
- **Imported skills** (`salesforce`, `agent-skills`, `mattpocock`, `salesforce-ux`) are
  third-party. `salesforce-ux` is the vendored SLDS2 starter kit the prototyper *runs*, not
  a document it reads — deviations to it go in the capability's `prototype/README.md`.
