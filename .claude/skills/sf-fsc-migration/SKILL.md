---
name: sf-fsc-migration
description: Domain knowledge for migrating a Salesforce Service Cloud org to Financial Services Cloud (FSC). Use when a spec or plan touches data model mapping (Account/Contact → Person Accounts/Household/Client), FSC-specific objects (Financial Account, Financial Holding, Financial Goal, Household, Relationship Groups), security model changes (Action Plans, sharing on FSC objects), licensing (FSC + OmniStudio SKUs), or migration sequencing/cutover strategy.
---

# Service Cloud → Financial Services Cloud migration knowledge

Use this to ground `plan.md` decisions in FSC realities, not generic CRM assumptions. This is reference knowledge to reason from — always verify against the target org's actual edition/managed package version, since FSC ships object/field changes across releases.

## Core data model shift

| Service Cloud (source) | FSC (target) | Notes |
|---|---|---|
| Account (business or B2C) | Account (Person Account or Business Account) + **Household** (group of Person Accounts) | FSC requires Person Accounts enabled at the org level — this is irreversible; confirm early in the constitution, not mid-project. |
| Contact | Person Account (merged) or Contact under a Business Account | Decide per segment (retail client vs business client) in the constitution, not per-journey. |
| Case | Case (kept) + optional **Action Plan** templates for financial processes (onboarding, dispute, claim) | FSC's Action Plans replace ad-hoc Case checklists/tasks. |
| Custom "policy"/"product" objects | **Financial Account**, **Financial Account Role**, **Financial Holding**, **Financial Goal** | Map legacy custom objects to these standard FSC objects wherever the shape fits — avoid re-inventing parallel custom objects. |
| Flat Contact-to-Contact relationships | **Relationship Groups** / **Group Membership** (Household, Business relationships) | Needed for "who else is on this account" views (spouse, beneficiary, business partner). |
| Reports/dashboards on Case/Opportunity | FSC-specific dashboards (Client 360, Household view) rely on the above objects being populated correctly | UI/journey work is blocked on data model + migration being correct — sequence accordingly. |

## Licensing & enablement (verify against the org before planning)

- FSC requires the **Financial Services Cloud** managed package + FSC user licenses/permission set licenses — not automatic in a Service Cloud org.
- **OmniStudio** (FlexCards, OmniScripts, DataRaptors, Integration Procedures) is a separate licensed add-on, commonly bundled with FSC but not guaranteed — confirm licensing before committing a journey's plan to OmniStudio.
- Person Accounts is an org-wide, non-reversible setting — a constitution-level decision, called out explicitly with the client before any spec depends on it.

## Migration sequencing pattern

1. **Foundation wave**: enable Person Accounts/FSC package, define Household/Business account model, security model (sharing rules, permission sets, Action Plan templates) — this is infrastructure, not a "journey," and should have its own spec.
2. **Data migration wave**: Account/Contact → Person Account/Household mapping, dedupe, and Financial Account/Holding backfill from legacy custom objects. Needs a `data-mapping.md` per object, field-level, with transformation rules and null/default handling.
3. **Journey waves**: one spec per client- or agent-facing journey (case intake, onboarding, service request, complaint handling), built on top of the foundation + migrated data. This is where `sf-ux-journey` (LWC vs OmniStudio) applies.
4. **Cutover wave**: parallel-run or big-bang decision, rollback plan, reconciliation reports — always its own plan section, never an afterthought bullet.

## Common pitfalls to flag in review

- A spec that assumes Contact still exists standalone for retail clients after Person Accounts is enabled.
- Sharing rules copied from Service Cloud without re-checking against FSC's Household/Relationship Group sharing model (over- or under-sharing financial data is a compliance issue, not just a bug).
- Journeys planned before the foundation/data-migration waves are locked — flag this as a sequencing risk in `analyze`.
- Treating OmniStudio as free — check licensing before a plan commits to it (see `sf-ux-journey` for the build-approach decision itself).
