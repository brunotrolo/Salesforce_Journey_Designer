# AGENTS.md — Salesforce Journey Designer

Instructions for any coding agent working **on this repository**. Vendor-neutral by design
(Claude Code, Cursor, Codex and friends). `CLAUDE.md` points here so there is a single
source of truth.

## What this repository is

This repository **is a skill**, not a Salesforce project. What ships is the content of
`.claude/` — 6 authored agents, the imported skills, rules and settings — installed into
someone else's project alongside its sister skill
[Salesforce Journey Developer](https://github.com/brunotrolo/Salesforce_Journey_Developer).

It takes one capability from idea to a design validated with the business:
`spec.md` → `plan.md` → prototype → `tasks.md`/`architecture.md`. **It never deploys
anything real.** The prototype runs locally on fixture data, and that is the point — it
validates the screen cheaply, before anyone commits to build tasks.

The practical consequence for you: a mistake here doesn't throw. It reads as a decided
requirement, passes business validation because nobody knew to question it, and gets built
for real downstream. Wrong guesses fail silently and convincingly.

## Authority order

1. `docs/sdd/constitution.md` — outranks every agent, plan and prototype. Four principles
   are NON-NEGOTIABLE (IV, V, VIII, IX); principle I is a hard gate. A decision it already
   fixed is not reopened mid-capability — propose the change to the user.
2. `.claude/rules/journey-designer.md` — structural project rules.
3. `.claude/rules/karpathy-guidelines.md` — behavioral discipline.

## Behavioral discipline

`.claude/rules/karpathy-guidelines.md` applies to work **on this repository** as much as to
the skill's execution:

1. **Think before coding** — an unresolved question is a marker, not a guess. Never invent a
   business rule to keep moving.
2. **Simplicity first** — standard-first; no acceptance criterion, screen element or plan
   entry nobody asked for.
3. **Surgical changes** — one capability at a time; don't reopen the constitution; never
   write deployable metadata here.
4. **Goal-driven execution** — each artifact is the verifiable criterion for the next.

## Non-negotiable rules

### 1. Authored vs. imported content
- **Authored** (`.claude/agents/`, `.claude/rules/`, `.claude/skills/fsc-spec`,
  `.claude/skills/fsc-status`): the project's own knowledge. Edit within the rules below.
- **Imported** (`.claude/skills/salesforce`, `agent-skills`, `mattpocock`, `salesforce-ux`):
  third-party, each carrying its own LICENSE. Consulted by path — or, for `salesforce-ux`,
  *executed* as the prototyping toolchain — **never rewritten** without an explicit
  maintainer decision. Documented deviations to the vendored starter kit belong in the
  capability's `prototype/README.md`.

### 2. Agent frontmatter uses `tools:`, not `allowed-tools:`
Subagents (`.claude/agents/*.md`) take `name`, `description`, `tools`, optionally `model`
and `memory`. That is **different** from a skill's `SKILL.md`, which uses `allowed-tools`.
Don't "fix" one into the other — different mechanisms, and the wrong field is ignored in
silence.

`fsc-design-system-architect` declares `memory: project`, which auto-loads
`.claude/agent-memory/fsc-design-system-architect/MEMORY.md`. That exact path is what the
harness reads; a `MEMORY.md` anywhere else is never loaded. The directory appears the first
time the agent writes memory — its absence is not a defect.

### 3. Rules auto-load — don't cross-reference them from agents
`journey-designer.md` and `karpathy-guidelines.md` have no `paths:` and load every session;
`prototipo.md` is scoped by `paths:`. Agents deliberately don't reference rules by path —
the mechanism already delivers them. Don't add reference lines, and don't restate a rule's
content inside an agent.

### 4. This repo never produces deployable metadata
No `force-app/` Apex, LWC or objects. A capability's prototype lives under
`specs/<domain>/<NNN>-<slug>/prototype/` and runs on fixture data. Real metadata is the
Developer skill's job; blurring the boundary produces code nobody validated.

### 5. Shared artifacts are shared
`specs/`, `docs/sdd/DOMAINS.md` and `docs/sdd/BACKLOG.md` are shared with the Developer
skill installed in the same project. Never fork a second copy.

### 6. Language convention
Agent, rule and skill files are written in **English**; `README.md` files are in **PT-BR**.
Talk to the user in PT-BR.

### 7. No real names
No company, org, client, vendor, class, field or identifier taken from a real org — in
content, filenames, commit messages or git authorship. Fixture and example names are
generic placeholders.

## Alinhamento com o framework agentic

This repo is being checked against Boris Cherny's agentic-engineering framework (plan-mode
default, subagent delegation, self-improvement/lessons loop, verification-before-done,
demand elegance, PostToolUse hooks, MCP/systemic integration, permission security). Where
it already stands, and what's intentionally still open:

- **Subagent strategy.** The 6-agent pipeline (`.claude/agents/fsc-sdd-orchestrator.md`,
  `fsc-journey-spec-writer.md`, `fsc-journey-ux-designer.md`, `fsc-html-prototyper.md`,
  `fsc-journey-tech-planner.md`, `fsc-design-system-architect.md`) is the strongest example
  in this arsenal of "one well-defined task per subagent": each one owns a single artifact
  or decision (spec, UX/plan, prototype, technical plan, cross-capability design system) and
  the orchestrator sequences them instead of any one agent doing everything.
- **Self-improvement/lessons.** Today only `fsc-design-system-architect.md` declares
  `memory: project`, auto-loading `.claude/agent-memory/fsc-design-system-architect/MEMORY.md`
  for decisions that must survive between its (rare) runs — including requests it
  **rejected**. The other 5 agents don't have this yet. Going forward, the convention is for
  each of them to adopt the same `.claude/agent-memory/<agent-name>/MEMORY.md` pattern, read
  at the start of each phase — each agent file now has a pointer line to that future path
  (see "Agent frontmatter" above). This is documented as a convention to adopt per agent as
  it comes up, not a retroactive rewrite — there's no settled content yet to seed those files
  with.
- **Verification before done.** The "Prototype validation gate" (`fsc-sdd-orchestrator.md`,
  step 10) is the hard stop: no `plan.md` technical sections, `tasks.md` or `architecture.md`
  without the user's explicit confirmation that the prototype matches `spec.md`'s acceptance
  scenarios. Underneath it, `fsc-html-prototyper.md` step 6 is its own build/lint/scorecard
  chain (restore overlay → verify wiring → `npm run build` → bundle-contains-component grep →
  SLDS linter → SLDS scorecard → clean) — now also triggered automatically by a `PostToolUse`
  hook (`.claude/settings.json`, `.claude/hooks/verify-prototype.mjs`) after any Edit/Write
  under the prototype's `src/` directory, instead of depending only on the agent remembering
  to run it manually.
- **Plan mode.** The mandatory pipeline — `spec.md` → `plan.md` → prototype →
  `tasks.md`/`architecture.md` — is itself a plan-mode-by-default structure, gated by the
  constitution's hard gates (Principle I, foundation) and soft gates (Principle II, System
  Design) before any capability reaches build tasks.
- **MCP/systemic integration.** Sem integração MCP — este repo roda localmente contra
  fixtures, nunca contra sistema real. That's not a gap to close; it's the same boundary
  `.claude/rules/journey-designer.md` already fixes ("never deploys anything real"). A real
  org connection, API or MCP server belongs to the sister Developer skill, never here.

## Repository map

```
.claude/
├── agents/              # 6 authored agents (orchestrator + spec/UX/prototype/plan + design system)
├── rules/
│   ├── journey-designer.md     # always-on: structural project rules
│   ├── karpathy-guidelines.md  # always-on: behavioral discipline (MIT)
│   └── prototipo.md            # path-scoped
├── skills/
│   ├── fsc-spec, fsc-status    # authored
│   └── salesforce, agent-skills, mattpocock, salesforce-ux   # imported, third-party
└── settings.json
docs/sdd/                # constitution, DOMAINS, BACKLOG (shared with the Developer skill)
specs/                   # one folder per capability (shared)
```

## Definition of done

- [ ] Change traces to an explicit request (nothing speculative)
- [ ] Constitution not reopened; existing style matched; no drive-by edits
- [ ] No imported/third-party skill rewritten
- [ ] No real names reintroduced
- [ ] README reflects structural changes

## Third-party licenses

- `.claude/skills/salesforce/` — `forcedotcom/sf-skills`, Apache-2.0 (LICENSE + NOTICE included)
- `.claude/skills/agent-skills/` — `addyosmani/agent-skills`, MIT (LICENSE included)
- `.claude/skills/mattpocock/` — `mattpocock/skills`, MIT (LICENSE included)
- `.claude/skills/salesforce-ux/` — `salesforce-ux/design-system-2-starter-kit` (LICENSE.txt included)
- `.claude/rules/karpathy-guidelines.md` — derived from
  [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills), MIT
