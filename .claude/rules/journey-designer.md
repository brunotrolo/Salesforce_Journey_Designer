# Salesforce Journey Designer — project rules

This project takes one capability of a Service Cloud → Financial Services Cloud migration
from idea to a design validated with the business: `spec.md` → `plan.md` → prototype →
`tasks.md`/`architecture.md`. These rules are always true here, whichever agent is running.

## The two-repo split

- **Designer** (this repo) specifies, designs and prototypes. It **never deploys anything
  real** — its prototype runs locally on fixture data, and that is the point: it validates
  the screen with the business cheaply, before anyone commits to build tasks.
- **Developer** (the sister skill, Salesforce Journey Developer) turns that finished design
  into real, deployed Salesforce metadata.
- Both install into the same project and share `specs/`, `docs/sdd/DOMAINS.md` and
  `docs/sdd/BACKLOG.md`. Never fork a second copy of those.

## Authority order

`docs/sdd/constitution.md` outranks every agent, plan and prototype in this repo. A decision
it already fixed — the account model, the OmniStudio boundary (FlexCard + OmniScript only),
the migration sequencing, the gates — is not reopened by an agent mid-capability. Propose the
change to the user instead. Four principles are marked NON-NEGOTIABLE (IV, V, VIII, IX), and
principle I is a hard gate of its own — the data foundation blocks a domain from starting,
unlike the System Design, which principle II makes a light gate. Treat those as stops, not
strong preferences.

## Design discipline

- **Standard-first.** Over-customization is why this migration exists. For each step, rule
  out standard/declarative FSC before choosing LWC, OmniScript or FlexCard. The
  padrão/misto/customizado verdict per step belongs in `plan.md` with its justification.
- **Componentize.** A prototype is never one file: the page component orchestrates, and each
  distinct card, modal, list or search panel is its own component, connected through
  documented props and events. This is what makes the Developer's real build a port instead
  of a rewrite.
- **An unresolved question is a marker, not a guess.** Leave `[NEEDS CLARIFICATION]` in the
  spec and ask the user; never invent a business rule to keep moving.
- **Never write real deployable metadata here** — no `force-app/` Apex, LWC or objects. That
  is the Developer's job, and blurring it produces code nobody validated.

## Conventions

- Agent, rule and skill files are written in English; `README.md` files are in PT-BR.
- Talk to the user in PT-BR.
