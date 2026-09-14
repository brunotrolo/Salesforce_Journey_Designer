# Skills importadas

Todas as skills usadas neste projeto de migração Service Cloud → Financial Services Cloud vivem aqui, dentro de uma única pasta `.claude/skills/`, organizadas por origem. Nenhuma foi escrita do zero — são importações de repositórios open-source (licenças MIT/Apache-2.0 preservadas em cada subpasta).

> **Como elas são usadas.** O Claude Code descobre comando `/` em `.claude/skills/<nome>/SKILL.md` — um nível só. Estas ficam um nível mais fundo, sob uma pasta de categoria (`salesforce/`, `agent-skills/`…), então **não aparecem no menu `/`** e não são auto-invocadas: são documentos de referência que os agentes leem por caminho explícito, no momento em que precisam. As únicas skills invocáveis deste repositório são as autorais `fsc-spec/` e `fsc-status/`, na raiz de `skills/`.
>
> **Curadoria, não cópia integral.** Vendorizamos exatamente o subconjunto que algum agente cita por nome — nada além. Uma skill vendorizada e nunca lida por nenhum agente é peso morto no repositório, não uma opção "disponível se precisar".

| Pasta | Origem | O que é |
|---|---|---|
| `salesforce/` | [forcedotcom/sf-skills](https://github.com/forcedotcom/sf-skills) | 6 skills oficiais da Salesforce: as fundamentais de **Apex, LWC e OmniStudio**, mais as duas de **SLDS2** (peso máximo — ver lista abaixo). |
| `mattpocock/` | [mattpocock/skills](https://github.com/mattpocock/skills) | Subconjunto curado: 2 das ~30 skills do repositório (`to-spec`, `grilling`) — ver tabela abaixo. |
| `agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Subconjunto curado: 1 das 26 skills do repositório (`test-driven-development`) — ver tabela abaixo. |
| `salesforce-ux/` | [salesforce-ux/design-system-2-starter-kit](https://github.com/salesforce-ux/design-system-2-starter-kit) | Ambiente de prototipagem oficial da Salesforce: LWC real + Vite + SLDS2 (tema "Cosmos"), o motor que `fsc-html-prototyper` usa para construir o protótipo de cada capacidade. Não é uma "skill" no sentido de instrução para o agente ler — é a ferramenta que o agente roda. Ver `salesforce-ux/README.md`. |

## Skills `mattpocock/` importadas — 2 de ~30

| Skill | Usada por | Para quê |
|---|---|---|
| `engineering/to-spec` | `fsc-journey-spec-writer` | Sintetizar spec do que já foi discutido, em vez de reentrevistar quando o usuário já descreveu a jornada na conversa. |
| `productivity/grilling` | `fsc-journey-spec-writer` | Perguntas cortantes e poucas, em vez de uma entrevista longa, quando a descrição da jornada está rasa. |

## Skills `agent-skills/` importadas — 1 de 26

| Skill | Usada por | Para quê |
|---|---|---|
| `test-driven-development` | `fsc-journey-tech-planner` | Disciplina de transformar critérios de aceite em plano de teste antes/junto da implementação — o único uso real de agent-skills neste projeto. |

## Skills Salesforce importadas (`salesforce/`)

**Design System (peso máximo — leia antes de qualquer outra skill ao decidir uma tela):** `design-systems-slds-apply`, `design-systems-slds-validate`

Apex: `platform-apex-generate`

LWC: `experience-lwc-generate` — seu `references/accessibility-guide.md` é a referência WCAG 2.1 AA do projeto (semântica HTML, ARIA, teclado, foco, contraste, leitor de tela); seu `references/jest-testing.md` é a referência de teste Jest para LWC.

OmniStudio: `omnistudio-omniscript-generate`, `omnistudio-flexcard-generate` — únicos dois artefatos OmniStudio usados neste projeto (não usamos Integration Procedure nem DataMapper/DataRaptor como artefatos próprios; a orquestração de backend de um OmniScript/FlexCard é feita em Apex, via `platform-apex-generate`).

## O que não tem skill própria aqui

Modelo de dados, segurança/sharing, automação declarativa (Flow), integração externa, SOQL, estratégia de teste Apex e migração SLDS1→2 não têm skill dedicada neste projeto — `fsc-journey-tech-planner` e os demais agentes resolvem essas partes com conhecimento próprio da plataforma Salesforce, não por skill importada. Cada agente deixa isso explícito onde relevante.
