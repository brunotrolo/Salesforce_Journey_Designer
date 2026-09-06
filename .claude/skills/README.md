# Skills importadas

Todas as skills usadas neste projeto de migração Service Cloud → Financial Services Cloud vivem aqui, dentro de uma única pasta `.claude/skills/`, organizadas por origem. Nenhuma foi escrita do zero — são importações de repositórios open-source (licenças MIT/Apache-2.0 preservadas em cada subpasta), com curadoria apenas onde indicado.

| Pasta | Origem | O que é | Curadoria aplicada |
|---|---|---|---|
| `salesforce/` | [forcedotcom/sf-skills](https://github.com/forcedotcom/sf-skills) | Skills oficiais da Salesforce para desenvolvimento na plataforma. | **Curada três vezes**: das 85 skills inicialmente importadas, restam 21 — estritamente as que têm relação direta com **Apex, LWC e OmniStudio** (mais SLDS2, que sustenta a camada visual do LWC). Ver critério de corte e lista completa abaixo. |
| `mattpocock/` | [mattpocock/skills](https://github.com/mattpocock/skills) | Skills de engenharia e produtividade (code review, TDD, domain modeling, diagnosing bugs, spec, tickets, etc.). | Importado por completo (categorias `engineering/`, `productivity/`, `misc/`, `in-progress/`); a pasta `deprecated/` da origem não continha skills, só um aviso, e não foi trazida. |
| `agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Skills de engenharia de software orientadas a agentes (spec-driven-development, TDD, code review, performance, segurança, CI/CD, etc.), com checklists em `_references/`. | Importado por completo. |
| `spec-kit/` | [github/spec-kit](https://github.com/github/spec-kit) | Metodologia e artefatos do Spec-Kit (constitution → specify → clarify → plan → tasks → analyze → implement). | Importados os templates de comando (`commands/`), templates de artefato (`templates/`), scripts auxiliares (`scripts/bash/`) e o template de constituição (`memory/`). **Não** trouxemos o CLI Python (`specify_cli`), testes, site de docs e newsletters — não se aplicam a este repositório. Os arquivos em `commands/` ainda usam os placeholders originais do Spec-Kit (`$ARGUMENTS`, caminhos de script) e precisam ser adaptados para `.claude/commands/` do Claude Code antes de virarem slash-commands funcionais aqui. **`templates/{spec,plan,tasks}-template.md` não são usados como forma literal**: são o template genérico de projeto de software do Spec-Kit (User Stories com prioridade P1/P2/P3, `FR-XXX`/`SC-XXX`, estrutura `src/`/`tests/`/`frontend`/`backend`, placeholders do CLI `specify`) — os agentes `fsc-journey-*` definem sua própria forma, Salesforce-específica, em vez de instanciar esses arquivos. O que de fato aproveitamos é a metodologia (`spec-driven.md`) e a disciplina de constituição/gates/rastreabilidade. |

## `ui-ux-pro-max/` — removida

Foi importada inicialmente como referência de UX/UI, mas usada como fonte **primária** de estilo para telas Salesforce nativas — é uma skill de design web/produto genérico (paletas, pareamento de fontes, presets GSAP), sem noção de SLDS2. O primeiro protótipo real (jornada de busca de clientes) saiu com aparência de app web genérico, não de tela Salesforce, por causa disso. **Removida do projeto.** A referência de UX/UI para telas Salesforce agora é exclusivamente `salesforce/design-systems-slds-apply` (abaixo) mais o ambiente vendorizado em `tools/prototype-studio/` (ver `tools/README.md`) — SLDS2 real via LWC, não uma aproximação.

## Critério de corte (três rodadas de curadoria)

Este projeto produz `spec.md` → `plan.md` → `tasks.md` → `architecture.md` → `prototype/` para uma capacidade — nunca deploy real (isso é fase de build, fora deste repositório, com `sf` CLI).

1. **Primeira curadoria** (import inicial, 85 skills): excluiu só verticals fora do domínio (Education Cloud, Field Service etc.).
2. **Segunda curadoria** (85 → 39): removeu skill de operação de org/pipeline/deploy (DX/DevOps, sandbox, encryption, DSAR, Data Cloud governance) sem uso por nenhum agente `fsc-*`, mais niches sem relação com uma jornada FSC.
3. **Terceira curadoria** (39 → 21, escopo final): o projeto trabalha com três tecnologias de build — **Apex, LWC e OmniStudio** — mais o **System Design (SLDS2)**, que sustenta a camada visual do LWC e tem prioridade máxima (única fonte de verdade visual do projeto — ver `docs/design-system/SYSTEM-DESIGN.md` e a nota sobre `ui-ux-pro-max/` acima). Removidas as 18 skills de `platform-*`/`automation-*`/`integration-*` que eram modelo de dados (custom object/field/metadata type/setting), segurança (sharing, OWD, permission sets), automação declarativa (Flow) e integração externa (Named Credentials) — nenhuma delas é Apex, LWC ou OmniStudio em si, por mais que apoiassem o `plan.md` de uma capacidade. `fsc-journey-tech-planner` agora resolve essa parte do plano com conhecimento próprio da plataforma, sem skill importada (ver nota no próprio agente). A única exceção mantida fora de Apex/LWC/OmniStudio/SLDS2 é `platform-soql-query`: SOQL/SOSL é escrito diretamente dentro de código Apex e de wire adapters LWC, não é uma skill de configuração de metadata.

## Skills Salesforce importadas (`salesforce/`)

**Design System (peso máximo — leia antes de qualquer outra skill ao decidir uma tela):** `design-systems-slds-apply`, `design-systems-slds-validate`, `design-systems-slds2-migrate`

Apex: `platform-apex-generate`, `platform-apex-test-generate`, `platform-soql-query`

LWC / Experience: `experience-lwc-generate`, `experience-lwc-design-generate`, `experience-lwc-base-components-integrate`, `experience-lwc-accessibility-jest-run`, `experience-lwc-security-validate`, `experience-accessibility-validate`, `experience-lds-best-practices-apply`, `experience-lds-data-requirements-generate`, `experience-lds-graphql-generate`

OmniStudio: `omnistudio-callable-apex-generate`, `omnistudio-datamapper-generate`, `omnistudio-dependencies-analyze`, `omnistudio-flexcard-generate`, `omnistudio-integration-procedure-generate`, `omnistudio-omniscript-generate`
