# Skills importadas

Todas as skills usadas neste projeto de migração Service Cloud → Financial Services Cloud vivem aqui, dentro de uma única pasta `.claude/skills/`, organizadas por origem. Nenhuma foi escrita do zero — são importações de repositórios open-source (licenças MIT/Apache-2.0 preservadas em cada subpasta).

| Pasta | Origem | O que é |
|---|---|---|
| `salesforce/` | [forcedotcom/sf-skills](https://github.com/forcedotcom/sf-skills) | 6 skills oficiais da Salesforce: as fundamentais de **Apex, LWC e OmniStudio**, mais as duas de **SLDS2** (peso máximo — ver lista abaixo). |
| `mattpocock/` | [mattpocock/skills](https://github.com/mattpocock/skills) | Skills de engenharia e produtividade (code review, TDD, domain modeling, diagnosing bugs, spec, tickets, etc.). |
| `agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Skills de engenharia de software orientadas a agentes (spec-driven-development, TDD, code review, performance, segurança, CI/CD, etc.), com checklists em `_references/`. |
| `spec-kit/` | [github/spec-kit](https://github.com/github/spec-kit) | Metodologia do Spec-Kit. Usamos a disciplina de constituição/gates/rastreabilidade e `spec-driven.md`; os templates de artefato (`templates/{spec,plan,tasks}-template.md`) **não** são a forma literal usada aqui — são o template genérico de projeto de software do Spec-Kit (User Stories P1/P2/P3, estrutura `src/`/`tests/`), e os agentes `fsc-journey-*` definem sua própria forma, Salesforce-específica, em vez de instanciá-los. Os arquivos em `commands/` ainda usam os placeholders originais do Spec-Kit e precisam ser adaptados para `.claude/commands/` do Claude Code antes de virarem slash-commands funcionais aqui. |
| `salesforce-ux/` | [salesforce-ux/design-system-2-starter-kit](https://github.com/salesforce-ux/design-system-2-starter-kit) | Ambiente de prototipagem oficial da Salesforce: LWC real + Vite + SLDS2 (tema "Cosmos"), o motor que `fsc-html-prototyper` usa para construir o protótipo de cada capacidade. Não é uma "skill" no sentido de instrução para o agente ler — é a ferramenta que o agente roda. Ver `salesforce-ux/README.md`. |

## Skills Salesforce importadas (`salesforce/`)

**Design System (peso máximo — leia antes de qualquer outra skill ao decidir uma tela):** `design-systems-slds-apply`, `design-systems-slds-validate`

Apex: `platform-apex-generate`

LWC: `experience-lwc-generate` — seu `references/accessibility-guide.md` é a referência WCAG 2.1 AA do projeto (semântica HTML, ARIA, teclado, foco, contraste, leitor de tela); seu `references/jest-testing.md` é a referência de teste Jest para LWC.

OmniStudio: `omnistudio-omniscript-generate`, `omnistudio-flexcard-generate` — únicos dois artefatos OmniStudio usados neste projeto (não usamos Integration Procedure nem DataMapper/DataRaptor como artefatos próprios; a orquestração de backend de um OmniScript/FlexCard é feita em Apex, via `platform-apex-generate`).

## O que não tem skill própria aqui

Modelo de dados, segurança/sharing, automação declarativa (Flow), integração externa, SOQL, estratégia de teste Apex e migração SLDS1→2 não têm skill dedicada neste projeto — `fsc-journey-tech-planner` e os demais agentes resolvem essas partes com conhecimento próprio da plataforma Salesforce, não por skill importada. Cada agente deixa isso explícito onde relevante.
