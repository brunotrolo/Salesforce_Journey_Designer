---
paths: specs/**/prototype/**, .claude/skills/salesforce-ux/**
---

# Prototypes

Full authoring guidance lives in `fsc-html-prototyper` and the vendored
`salesforce-ux/design-system-2-starter-kit` — this file is only what must hold for any
prototype file touched here, by any agent.

- **The prototype exists to be validated with the business, not to look finished.** It is
  real LWC + SLDS2 running on the starter kit precisely so it renders like a real Lightning
  screen, and it runs on fixture data precisely so nobody mistakes it for a build.
- **Componentize for real.** One file per distinct card, modal, list or panel, wired through
  documented `@api` props and custom events — never one large page component. The Developer
  skill ports this structure directly; a flattened prototype forces a rewrite.
- **Every acceptance scenario in `spec.md` must be reachable by clicking**, including the
  empty, loading and error states. A prototype that only demonstrates the happy path has not
  validated the spec.
- `prototype/README.md` is part of the deliverable: the walkthrough (which screen proves
  which acceptance scenario), how to run it, and what the validation produced.
- **Modify the vendored kit only when justified, and write down why** in that capability's
  `prototype/README.md`. It is third-party source.
- The SLDS scorecard checks attribute presence only. It is not an accessibility result and
  must never be reported as one — real WCAG checking happens in the Developer skill.
