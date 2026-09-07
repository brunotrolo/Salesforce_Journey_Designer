# Skills importadas

Todas as skills usadas neste projeto de migração Service Cloud → Financial Services Cloud vivem aqui, dentro de uma única pasta `.claude/skills/`, organizadas por origem. Nenhuma foi escrita do zero — são importações de repositórios open-source (licenças MIT/Apache-2.0 preservadas em cada subpasta).

> **Como elas são usadas.** O Claude Code descobre comando `/` em `.claude/skills/<nome>/SKILL.md` — um nível só. Estas ficam um nível mais fundo, sob uma pasta de categoria (`salesforce/`, `agent-skills/`…), então **não aparecem no menu `/`** e não são auto-invocadas: são documentos de referência que os agentes leem por caminho explícito, no momento em que precisam. As únicas skills invocáveis deste repositório são as autorais `fsc-spec/` e `fsc-status/`, na raiz de `skills/`.
>
> **Curadoria, não cópia integral.** `mattpocock/skills` e `addyosmani/agent-skills` são repositórios grandes (~30 e 26 skills, respectivamente); vendorizamos só o subconjunto que algum agente cita por nome (ver as duas tabelas abaixo) — igual à disciplina que a skill irmã **Salesforce Journey Developer** já documenta para os catálogos que ela importa. Uma skill vendorizada e nunca lida por nenhum agente é peso morto no repositório, não uma opção "disponível se precisar".

| Pasta | Origem | O que é |
|---|---|---|
| `salesforce/` | [forcedotcom/sf-skills](https://github.com/forcedotcom/sf-skills) | 6 skills oficiais da Salesforce: as fundamentais de **Apex, LWC e OmniStudio**, mais as duas de **SLDS2** (peso máximo — ver lista abaixo). |
| `mattpocock/` | [mattpocock/skills](https://github.com/mattpocock/skills) | Subconjunto curado: 3 das ~30 skills do repositório (`to-spec`, `implement`, `grilling`) — ver tabela abaixo. |
| `agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Subconjunto curado: 5 das 26 skills do repositório, todas de planejamento/decomposição de trabalho — ver tabela abaixo. |
| `spec-kit/` | [github/spec-kit](https://github.com/github/spec-kit) | Metodologia do Spec-Kit. Usamos a disciplina de constituição/gates/rastreabilidade e `spec-driven.md`; os templates de artefato (`templates/{spec,plan,tasks}-template.md`) **não** são a forma literal usada aqui — são o template genérico de projeto de software do Spec-Kit (User Stories P1/P2/P3, estrutura `src/`/`tests/`), e os agentes `fsc-journey-*` definem sua própria forma, Salesforce-específica, em vez de instanciá-los. Os arquivos em `commands/` ainda usam os placeholders originais do Spec-Kit e precisam ser adaptados para `.claude/commands/` do Claude Code antes de virarem slash-commands funcionais aqui. |
| `salesforce-ux/` | [salesforce-ux/design-system-2-starter-kit](https://github.com/salesforce-ux/design-system-2-starter-kit) | Ambiente de prototipagem oficial da Salesforce: LWC real + Vite + SLDS2 (tema "Cosmos"), o motor que `fsc-html-prototyper` usa para construir o protótipo de cada capacidade. Não é uma "skill" no sentido de instrução para o agente ler — é a ferramenta que o agente roda. Ver `salesforce-ux/README.md`. |

## Skills `mattpocock/` importadas — 3 de ~30

| Skill | Usada por | Para quê |
|---|---|---|
| `engineering/to-spec` | `fsc-journey-spec-writer` | Sintetizar spec do que já foi discutido, em vez de reentrevistar quando o usuário já descreveu a jornada na conversa. |
| `productivity/grilling` | `fsc-journey-spec-writer` | Perguntas cortantes e poucas, em vez de uma entrevista longa, quando a descrição da jornada está rasa. |
| `engineering/implement` | `fsc-journey-tech-planner` | Dimensionar tarefas para cada uma ser independentemente entregável. |

O restante do repositório (`wizard`, `ask-matt`, `wayfinder`, `retro`, as skills de `writing-*`, `grill-me`/`grill-with-docs` — ambas apenas atalhos que redirecionam para `grilling`, sem conteúdo próprio — etc.) não foi vendorizado: nenhum agente daqui precisa delas.

## Skills `agent-skills/` importadas — 5 de 26

| Skill | Usada por | Para quê |
|---|---|---|
| `spec-driven-development` | `fsc-journey-spec-writer` | Decompor um requisito que na verdade é várias capacidades independentemente testáveis. |
| `planning-and-task-breakdown` | `fsc-journey-spec-writer` | Escopar uma jornada grande demais num mapa de capacidades antes de escrever um spec só. |
| `constraint-driven-development`, `test-driven-development` | `fsc-journey-tech-planner` | Disciplina de transformar critério de aceite em plano de teste antes/junto da implementação. |
| `incremental-implementation` | `fsc-journey-tech-planner` | Mesmo propósito do `implement` do mattpocock — dimensionar tarefas entregáveis independentemente. |

O restante (`frontend-ui-engineering`, `performance-optimization`, `security-and-hardening`, `ci-cd-and-automation`, `browser-testing-with-devtools`, etc.) não foi vendorizado — são de build/deploy/operação real, fora do escopo deste repositório (esse é o motivo de existir uma skill irmã, o **Salesforce Journey Developer**, que importa esse tipo de skill para si).

## Skills Salesforce importadas (`salesforce/`)

**Design System (peso máximo — leia antes de qualquer outra skill ao decidir uma tela):** `design-systems-slds-apply`, `design-systems-slds-validate`

Apex: `platform-apex-generate`

LWC: `experience-lwc-generate` — seu `references/accessibility-guide.md` é a referência WCAG 2.1 AA do projeto (semântica HTML, ARIA, teclado, foco, contraste, leitor de tela); seu `references/jest-testing.md` é a referência de teste Jest para LWC.

OmniStudio: `omnistudio-omniscript-generate`, `omnistudio-flexcard-generate` — únicos dois artefatos OmniStudio usados neste projeto (não usamos Integration Procedure nem DataMapper/DataRaptor como artefatos próprios; a orquestração de backend de um OmniScript/FlexCard é feita em Apex, via `platform-apex-generate`).

## O que não tem skill própria aqui

Modelo de dados, segurança/sharing, automação declarativa (Flow), integração externa, SOQL, estratégia de teste Apex e migração SLDS1→2 não têm skill dedicada neste projeto — `fsc-journey-tech-planner` e os demais agentes resolvem essas partes com conhecimento próprio da plataforma Salesforce, não por skill importada. Cada agente deixa isso explícito onde relevante.
