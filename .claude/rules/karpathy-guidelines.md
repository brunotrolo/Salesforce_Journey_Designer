# Karpathy Guidelines — applied to specifying, designing and prototyping

Behavioral guidelines to reduce common LLM coding mistakes, derived from
[Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM
coding pitfalls.

Source: [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
(MIT). The four sections below are reproduced **in full**; each is followed by an
`In this project` block contextualising it for design work. The contextualisation adds — it
never replaces or relaxes the original guidance.

These guidelines are always true here, whichever agent is running. `journey-designer.md`
remains the authority on this project's structural rules, and `docs/sdd/constitution.md`
outranks both.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

> **In this project.** This is the single most load-bearing guideline here, and
> `journey-designer.md` already states it as a rule: *an unresolved question is a marker,
> not a guess — leave `[NEEDS CLARIFICATION]` and ask; never invent a business rule to keep
> moving.*
>
> Understand why it carries more weight in this repo than in one that writes code. A wrong
> guess in code fails loudly: it throws, a test goes red, a deploy errors. A wrong guess in
> a spec fails **silently and convincingly** — it reads as a decided requirement, survives
> business validation because nobody knew to question it, becomes `tasks.md`, and gets
> built for real by the Developer skill. By the time it's wrong, it's deployed.
>
> So: an invented minimum value, an assumed mandatory field, a made-up error message, a
> guessed state transition — each is a `[NEEDS CLARIFICATION]`, never a plausible default
> written in the confident voice of a spec.

---

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

> **In this project.** `Standard-first` is this guideline in Salesforce terms:
> over-customization is the reason this migration exists, so each step must rule out
> standard/declarative FSC before reaching for LWC, OmniScript or FlexCard — with the
> padrão/misto/customizado verdict and its justification in `plan.md`.
>
> The design-specific trap is **scope creep dressed as thoroughness**: a spec with
> acceptance criteria nobody asked for, a screen with a filter panel the journey never
> needs, a plan proposing a Platform Event where a lookup field settles it. Every
> speculative element you add here is one the Developer will faithfully build and someone
> will maintain for years.
>
> Note the one place where more structure is *required*, not speculative: `Componentize`.
> A prototype split into a page component plus real child components isn't over-engineering
> — it's what makes the Developer's build a port instead of a rewrite. Simplicity is about
> scope, not about collapsing structure the next step depends on.

---

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

> **In this project.** Three boundaries, all already fixed by other rules, that this
> guideline explains the reasoning for:
> **(a) The constitution.** `docs/sdd/constitution.md` outranks every agent, plan and
> prototype. A decision it already fixed — the account model, the OmniStudio boundary, the
> sequencing, the gates — is not reopened mid-capability because an agent would design it
> differently. Propose the change to the user. This is *"match existing style, even if
> you'd do it differently"* applied to architecture.
> **(b) One capability at a time.** Working on `specs/<domain>/<NNN>-<slug>/` is not a
> licence to revise a neighbouring capability's spec, renumber the backlog, or restructure
> `DOMAINS.md` along the way. Noticed a real problem elsewhere? Mention it; don't fix it.
> **(c) The repo boundary.** Never write real deployable metadata here — no `force-app/`
> Apex, LWC or objects. That is the Developer's job, and blurring it produces code nobody
> validated. A prototype runs on fixture data, locally, on purpose.

---

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require
constant clarification.

> **In this project.** The chain `spec.md` → `plan.md` → prototype → `tasks.md` is exactly
> this pattern: each artifact is the verifiable criterion for the next. Testable acceptance
> criteria in the spec are what the prototype must demonstrate; the prototype running on
> fixture data is what the business validates before anyone commits to build tasks.
>
> The weak criteria to refuse are the design-shaped ones: *"the screen looks right"*,
> *"the business will probably approve"*, *"this covers the happy path"*. The strong
> criterion is a named acceptance scenario that someone can sit in front of the prototype
> and exercise — including the ones that should fail. A fixture whose values violate the
> spec's own rules (a minimum below the stated minimum, a field longer than its limit)
> invalidates the very scenario it was meant to prove.
>
> The constitution's gates are criteria of the same kind: principle I is a hard gate, not a
> strong preference. A gate you declared passed without exercising it is a weak criterion
> wearing a strong one's clothes.

---

*Guidelines derived from Andrej Karpathy's observations, via
[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills),
MIT license. The `In this project` blocks are this project's own contextualisation.*
