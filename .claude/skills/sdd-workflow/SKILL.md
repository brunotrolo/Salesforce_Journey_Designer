---
name: sdd-workflow
description: Spec-Driven Development (SDD) engine for the Service Cloud → Financial Services Cloud (FSC) migration. Use whenever the user wants to start, continue, or review a "jornada" (journey/feature) spec — creating a constitution, writing a spec, clarifying ambiguities, producing a technical plan, breaking it into tasks, or checking consistency before implementation. Mirrors the GitHub Spec-Kit lifecycle (constitution → specify → clarify → plan → tasks → analyze → implement), adapted to Salesforce metadata, OmniStudio and LWC delivery.
---

# SDD Workflow — Salesforce Odin (Service Cloud → FSC)

This skill defines how specs are authored and evolved in this repo. It does not replace Salesforce/OmniStudio knowledge (see `sf-fsc-migration` and `sf-ux-journey`) — it defines the *process* and *artifacts*.

## Lifecycle

1. **Constitution** (`docs/sdd/constitution.md`) — project-wide non-negotiables (data model rules, security model, UX principles, tooling choices). Written once, amended rarely, referenced by every spec.
2. **Specify** — for each journey/feature, create `specs/NNN-slug/spec.md` from `templates/spec-template.md`. Describes WHAT and WHY from the business/user perspective. No implementation detail (no object API names, no component names) unless it is a hard constraint.
3. **Clarify** — before planning, scan the spec for `[NEEDS CLARIFICATION: ...]` markers or ambiguous requirements (vague adjectives, unstated data ownership, undefined error/edge cases). Ask the user targeted questions (use `AskUserQuestion` for anything only a human can decide) and update the spec in place. Do not proceed to plan with unresolved markers.
4. **Plan** — create `specs/NNN-slug/plan.md` from `templates/plan-template.md`. Describes HOW: target org (Service Cloud source vs FSC target), objects/fields touched, automation (Flow/Apex/OmniStudio), UI approach (LWC vs OmniStudio — invoke `sf-ux-journey` for this decision), data migration approach, security model impact (sharing rules, permission sets), integration touchpoints, test strategy.
5. **Tasks** — create `specs/NNN-slug/tasks.md` from `templates/tasks-template.md`. Ordered, independently verifiable tasks derived strictly from the plan. Group by: data model, automation, UI, integration, migration/ETL, tests, cutover.
6. **Analyze** — cross-check spec ↔ plan ↔ tasks for gaps, contradictions, or scope creep before implementation starts. Report findings; do not silently fix scope decisions.
7. **Implement** — execute tasks in order, checking each off in `tasks.md` as completed.

## Numbering and layout

- Journeys live under `specs/<NNN>-<kebab-case-name>/` (e.g. `specs/001-case-intake-journey/`).
- `NNN` is zero-padded, sequential, assigned when `spec.md` is first created — check existing `specs/` directories to pick the next number.
- Each journey folder holds `spec.md`, `plan.md`, `tasks.md`, and optionally `research.md` (open questions/spikes) or `data-mapping.md` (field-level source→target mapping for that journey).

## Writing rules

- **spec.md** stays implementation-agnostic. Business language: "the agent must see the client's active policies before opening a case," not "add a lookup to `InsurancePolicy__c` on `Case`."
- Every requirement is testable. Prefer Gherkin-ish acceptance criteria (`Given/When/Then`) over prose.
- Mark unresolved decisions explicitly as `[NEEDS CLARIFICATION: question]` rather than guessing — guessing is the most common source of rework in Salesforce migrations (wrong object model chosen too early).
- **plan.md** is where Service Cloud vs FSC object mapping, OmniStudio vs LWC, and Apex vs Flow decisions get made and justified — always with a rationale, not just a choice.
- **tasks.md** tasks must be small enough to map to one PR/change-set each, and must name concrete Salesforce artifacts (object, field, component, flow) — this is where the abstraction from spec.md ends.

## When invoked

- If the user names a journey and asks to "criar o spec"/"iniciar SDD": check if `docs/sdd/constitution.md` exists and is filled in; if not, do that first (ask the minimum needed questions). Then create the next-numbered `specs/NNN-.../spec.md`.
- If a spec already exists and the user asks to advance it, read the existing files first and continue the lifecycle from where it left off — never regenerate earlier artifacts from scratch without being asked.
- If the user asks for the UI/journey approach (OmniStudio vs LWC) mid-spec or mid-plan, hand off reasoning to `sf-ux-journey`.
- If the user asks about FSC data model, migration waves, or Service Cloud→FSC object mapping, hand off to `sf-fsc-migration`.
