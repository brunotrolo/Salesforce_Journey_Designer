# Skills importadas

Todas as skills usadas neste projeto de migração Service Cloud → Financial Services Cloud vivem aqui, dentro de uma única pasta `.claude/skills/`, organizadas por origem. Nenhuma foi escrita do zero — são importações de repositórios open-source (licenças MIT/Apache-2.0 preservadas em cada subpasta), com curadoria apenas onde indicado.

| Pasta | Origem | O que é | Curadoria aplicada |
|---|---|---|---|
| `salesforce/` | [forcedotcom/sf-skills](https://github.com/forcedotcom/sf-skills) | Skills oficiais da Salesforce para desenvolvimento na plataforma. | **Curada quatro vezes**: das 85 skills inicialmente importadas, restam 6 — as fundamentais de **Apex, LWC e OmniStudio**, mais as duas de **SLDS2** (peso máximo). Ver critério de corte e lista completa abaixo. |
| `mattpocock/` | [mattpocock/skills](https://github.com/mattpocock/skills) | Skills de engenharia e produtividade (code review, TDD, domain modeling, diagnosing bugs, spec, tickets, etc.). | Importado por completo (categorias `engineering/`, `productivity/`, `misc/`, `in-progress/`); a pasta `deprecated/` da origem não continha skills, só um aviso, e não foi trazida. |
| `agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Skills de engenharia de software orientadas a agentes (spec-driven-development, TDD, code review, performance, segurança, CI/CD, etc.), com checklists em `_references/`. | Importado por completo. |
| `spec-kit/` | [github/spec-kit](https://github.com/github/spec-kit) | Metodologia e artefatos do Spec-Kit (constitution → specify → clarify → plan → tasks → analyze → implement). | Importados os templates de comando (`commands/`), templates de artefato (`templates/`), scripts auxiliares (`scripts/bash/`) e o template de constituição (`memory/`). **Não** trouxemos o CLI Python (`specify_cli`), testes, site de docs e newsletters — não se aplicam a este repositório. Os arquivos em `commands/` ainda usam os placeholders originais do Spec-Kit (`$ARGUMENTS`, caminhos de script) e precisam ser adaptados para `.claude/commands/` do Claude Code antes de virarem slash-commands funcionais aqui. **`templates/{spec,plan,tasks}-template.md` não são usados como forma literal**: são o template genérico de projeto de software do Spec-Kit (User Stories com prioridade P1/P2/P3, `FR-XXX`/`SC-XXX`, estrutura `src/`/`tests/`/`frontend`/`backend`, placeholders do CLI `specify`) — os agentes `fsc-journey-*` definem sua própria forma, Salesforce-específica, em vez de instanciar esses arquivos. O que de fato aproveitamos é a metodologia (`spec-driven.md`) e a disciplina de constituição/gates/rastreabilidade. |
| `salesforce-ux/` | [salesforce-ux/design-system-2-starter-kit](https://github.com/salesforce-ux/design-system-2-starter-kit) | Ambiente de prototipagem oficial da Salesforce: LWC real + Vite + SLDS2 (tema "Cosmos"), o motor que `fsc-html-prototyper` usa para construir o protótipo de cada capacidade. Não é uma "skill" no sentido de instrução para o agente ler — é a ferramenta que o agente roda. Vive aqui, dentro de `.claude/skills/`, pelo mesmo motivo que as demais: é contexto do projeto, não uma pasta solta na raiz do repositório. Ver `salesforce-ux/README.md`. | Vendorizado sem alteração de código (só removidos `.git/`, `node_modules/`, `dist/`, `.vite/`). |

## `ui-ux-pro-max/` — removida

Foi importada inicialmente como referência de UX/UI, mas usada como fonte **primária** de estilo para telas Salesforce nativas — é uma skill de design web/produto genérico (paletas, pareamento de fontes, presets GSAP), sem noção de SLDS2. O primeiro protótipo real (jornada de busca de clientes) saiu com aparência de app web genérico, não de tela Salesforce, por causa disso. **Removida do projeto.** A referência de UX/UI para telas Salesforce agora é exclusivamente `salesforce/design-systems-slds-apply` (abaixo) mais o ambiente vendorizado em `.claude/skills/salesforce-ux/design-system-2-starter-kit/` (ver `.claude/skills/salesforce-ux/README.md`) — SLDS2 real via LWC, não uma aproximação.

## Critério de corte (quatro rodadas de curadoria)

Este projeto produz `spec.md` → `plan.md` → `tasks.md` → `architecture.md` → `prototype/` para uma capacidade — nunca deploy real (isso é fase de build, fora deste repositório, com `sf` CLI).

1. **Primeira curadoria** (import inicial, 85 skills): excluiu só verticals fora do domínio (Education Cloud, Field Service etc.).
2. **Segunda curadoria** (85 → 39): removeu skill de operação de org/pipeline/deploy (DX/DevOps, sandbox, encryption, DSAR, Data Cloud governance) sem uso por nenhum agente `fsc-*`, mais niches sem relação com uma jornada FSC.
3. **Terceira curadoria** (39 → 21): o projeto trabalha com três tecnologias de build — **Apex, LWC e OmniStudio** — mais o **System Design (SLDS2)**. Removidas as 18 skills de `platform-*`/`automation-*`/`integration-*` que eram modelo de dados, segurança, automação declarativa e integração externa — nenhuma delas é Apex, LWC ou OmniStudio em si. `fsc-journey-tech-planner` passou a resolver essa parte do plano com conhecimento próprio da plataforma, sem skill importada.
4. **Quarta curadoria** (21 → 6, escopo final): mesmo dentro de Apex/LWC/OmniStudio/SLDS2, só as 21 tinham peso desigual — muitas cobriam nuances (RTL, TypeScript migration, GraphQL, Jest accessibility runner, dependency analysis) que os agentes deste projeto nunca precisam para produzir `spec.md`→`prototype/`. Restaram só as **fundamentais**: uma por pilar de tecnologia, mais as duas de SLDS2 que continuam com prioridade máxima. Tudo que uma skill removida cobria (accessibility, test strategy, OmniStudio backend orchestration, SOQL, migração SLDS1→2) passou a ser conhecimento próprio dos agentes, documentado explicitamente em cada `.claude/agents/fsc-*.md` para não fingir que uma skill inexistente ainda está sendo consultada.

## Skills Salesforce importadas (`salesforce/`)

**Design System (peso máximo — leia antes de qualquer outra skill ao decidir uma tela):** `design-systems-slds-apply`, `design-systems-slds-validate`

Apex: `platform-apex-generate`

LWC: `experience-lwc-generate` (its bundled `references/accessibility-guide.md` is the project's actual WCAG 2.1 AA reference — no separate accessibility skill is imported; see the agents' own notes on why `design-systems-slds-validate`'s accessibility scoring alone isn't enough)

OmniStudio: `omnistudio-omniscript-generate`, `omnistudio-flexcard-generate`
