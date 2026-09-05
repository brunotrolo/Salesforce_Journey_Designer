---
name: sf-ux-journey
description: UX/UI design and build-approach guidance for Salesforce CRM journeys (Service Cloud/FSC). Use when a plan.md needs to decide LWC vs OmniStudio (FlexCards/OmniScripts) for a screen or flow, when designing the screen-by-screen journey for agents or clients, or when translating a spec's acceptance criteria into a concrete UI structure before writing tasks.md.
---

# Salesforce CRM journey design — LWC vs OmniStudio

This skill covers two things: (1) how to design a screen journey for a Salesforce persona (service agent, financial advisor, client via Experience Cloud), and (2) how to decide the build technology per screen/step. It feeds `plan.md`; it does not replace `sdd-workflow`'s process.

## Step 1 — Map the journey before picking technology

For every journey in scope, produce a simple table before deciding build approach:

| Step | Persona | Trigger | Data read | Data written | Decision points | Exit condition |
|---|---|---|---|---|---|---|

Do this in business language first (matches `spec.md`) — technology choice happens per-step in `plan.md`, not per-journey. A single journey commonly mixes LWC and OmniStudio steps.

## Step 2 — Decide LWC vs OmniStudio, per step

Ask these questions in order; the first one that gives a clear answer decides it — don't average them.

1. **Does the org already have OmniStudio licensed and enabled?** If not, and getting it licensed isn't already in scope, the answer is LWC by default — don't plan around a tool that isn't provisioned.
2. **Will business/ops need to change this step's flow or fields without a deployment?** (e.g. onboarding questionnaires, eligibility scripts, KYC steps that compliance iterates on) → **OmniScript**. Deployment-gated changes for something that changes every quarter is a maintenance cost, not a technical purity concern.
3. **Is this primarily a record/context display (client 360, account summary, related financial holdings) with light conditional layout?** → **FlexCard**. Faster to build and to hand off to admins than an LWC for the same result.
4. **Does the step need custom client-side logic, complex state, real-time validation beyond DataRaptor/Integration Procedure capability, tight performance requirements, or reusable design-system components shared across many journeys?** → **LWC**. OmniStudio's declarative layer has a real ceiling on complex interaction/state and on unit-testability (Jest doesn't cover OmniScripts).
5. **Does the step orchestrate multiple backend calls/objects but present a simple form?** → **OmniScript + Integration Procedures + DataRaptors** for orchestration, optionally embedding an LWC only for the one sub-piece that needs custom logic (hybrid, not all-or-nothing).
6. **Is this an Experience Cloud (client-facing, external) page?** → Bias further toward OmniStudio for guided steps (easier compliance sign-off on wording/branching) but keep authentication-sensitive or highly interactive widgets (document upload with client-side validation, e-signature embed) in LWC.

## Step 3 — Default pattern for this migration

Unless a step's answer above says otherwise:
- **Guided, business-iterated, multi-step data capture** (onboarding, service request intake, dispute/claim intake, KYC): OmniScript, backed by Integration Procedures/DataRaptors for FSC object reads/writes.
- **Record summaries and contextual panels** (Household view, Client 360, related financial accounts on a Case): FlexCards.
- **Complex reusable widgets, anything with non-trivial client logic, or anything needing full automated test coverage (Jest)**: LWC, exposed as a Lightning App Builder component or embedded inside an OmniScript custom LWC step when the surrounding flow is otherwise OmniStudio.
- **Never** rebuild an OmniStudio-capable guided flow entirely in Apex/VF/LWC just to avoid the license question — resolve licensing in the constitution/foundation wave instead (see `sf-fsc-migration`).

## Recording the decision in plan.md

For each journey step, plan.md must state: chosen approach, the one deciding question from Step 2 that determined it, and the concrete artifacts (OmniScript name, FlexCard name, or LWC component name) — this becomes the basis for tasks.md.

## Anti-patterns to call out in review

- Choosing OmniStudio purely because "it's the FSC standard" without checking licensing or whether the step actually needs business-iterable flow.
- Choosing LWC purely because the team is more comfortable with code, when the step is a textbook guided-data-capture case that will need frequent non-technical iteration.
- Splitting one journey across many small OmniScripts/LWCs with no shared session/state model — define how state passes between steps (record IDs via OmniScript's params, or a parent LWC's state) explicitly in plan.md.
