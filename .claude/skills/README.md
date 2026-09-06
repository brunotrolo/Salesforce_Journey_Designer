# Skills importadas

Todas as skills usadas neste projeto de migração Service Cloud → Financial Services Cloud vivem aqui, dentro de uma única pasta `.claude/skills/`, organizadas por origem. Nenhuma foi escrita do zero — são importações de repositórios open-source (licenças MIT/Apache-2.0 preservadas em cada subpasta), com curadoria apenas onde indicado.

| Pasta | Origem | O que é | Curadoria aplicada |
|---|---|---|---|
| `salesforce/` | [forcedotcom/sf-skills](https://github.com/forcedotcom/sf-skills) | Skills oficiais da Salesforce para desenvolvimento na plataforma. | **Curada, e recurada**: das 85 skills inicialmente importadas, só 39 sobreviveram — as que servem diretamente ao que os agentes `fsc-journey-*` produzem (spec → plan → prototype de uma capacidade construída em Apex, LWC e OmniStudio), não a fase de build/deploy em si (que fica para depois, com `sf` CLI). Ver critério de corte e lista completa abaixo. |
| `mattpocock/` | [mattpocock/skills](https://github.com/mattpocock/skills) | Skills de engenharia e produtividade (code review, TDD, domain modeling, diagnosing bugs, spec, tickets, etc.). | Importado por completo (categorias `engineering/`, `productivity/`, `misc/`, `in-progress/`); a pasta `deprecated/` da origem não continha skills, só um aviso, e não foi trazida. |
| `agent-skills/` | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Skills de engenharia de software orientadas a agentes (spec-driven-development, TDD, code review, performance, segurança, CI/CD, etc.), com checklists em `_references/`. | Importado por completo. |
| `spec-kit/` | [github/spec-kit](https://github.com/github/spec-kit) | Metodologia e artefatos do Spec-Kit (constitution → specify → clarify → plan → tasks → analyze → implement). | Importados os templates de comando (`commands/`), templates de artefato (`templates/`), scripts auxiliares (`scripts/bash/`) e o template de constituição (`memory/`). **Não** trouxemos o CLI Python (`specify_cli`), testes, site de docs e newsletters — não se aplicam a este repositório. Os arquivos em `commands/` ainda usam os placeholders originais do Spec-Kit (`$ARGUMENTS`, caminhos de script) e precisam ser adaptados para `.claude/commands/` do Claude Code antes de virarem slash-commands funcionais aqui. **`templates/{spec,plan,tasks}-template.md` não são usados como forma literal**: são o template genérico de projeto de software do Spec-Kit (User Stories com prioridade P1/P2/P3, `FR-XXX`/`SC-XXX`, estrutura `src/`/`tests/`/`frontend`/`backend`, placeholders do CLI `specify`) — os agentes `fsc-journey-*` definem sua própria forma, Salesforce-específica, em vez de instanciar esses arquivos. O que de fato aproveitamos é a metodologia (`spec-driven.md`) e a disciplina de constituição/gates/rastreabilidade. |

## `ui-ux-pro-max/` — removida

Foi importada inicialmente como referência de UX/UI, mas usada como fonte **primária** de estilo para telas Salesforce nativas — é uma skill de design web/produto genérico (paletas, pareamento de fontes, presets GSAP), sem noção de SLDS2. O primeiro protótipo real (jornada de busca de clientes) saiu com aparência de app web genérico, não de tela Salesforce, por causa disso. **Removida do projeto.** A referência de UX/UI para telas Salesforce agora é exclusivamente `salesforce/design-systems-slds-apply` (abaixo) mais o ambiente vendorizado em `tools/prototype-studio/` (ver `tools/README.md`) — SLDS2 real via LWC, não uma aproximação.

## Critério de corte (segunda curadoria)

Este projeto produz `spec.md` → `plan.md` → `tasks.md` → `architecture.md` → `prototype/` para uma capacidade — nunca deploy real (isso é fase de build, fora deste repositório, com `sf` CLI). A primeira curadoria (85 skills) só excluiu verticals fora do domínio (Education Cloud, Field Service etc.); ainda sobrava muita skill de **operação de org/pipeline/deploy** (DX/DevOps, sandbox, encryption, DSAR, Data Cloud governance) sem uso por nenhum agente `fsc-*` — nenhuma delas aparece referenciada em `.claude/agents/*.md`. Populavam a pasta sem servir ao ciclo real.

Segunda curadoria: mantidas apenas as skills que sustentam Apex, LWC e OmniStudio no nível de **especificação e design de uma capacidade**, mais o **System Design (SLDS2)**, que tem prioridade máxima — é a única fonte de verdade visual do projeto (ver `docs/design-system/SYSTEM-DESIGN.md` e a nota histórica em `ui-ux-pro-max/` abaixo). Removidas: toda skill de DX/DevOps (pipeline, promote, org management, code analyzer, ApexGuru), execução/deploy real (`platform-metadata-deploy`/`retrieve`, `platform-apex-test-run`, `platform-apex-logs-debug`), operação de sandbox/compliance (`platform-sandbox-configure`, `platform-encryption-configure`, `platform-datamask-run`, `platform-dsar-policy-manage`), e verticals/niches sem relação com uma jornada FSC (EPC/Industries catalog, Data Cloud policy rules, Salesforce Connect, HXL/MCP widgets, RTL/TypeScript/Aura migration de LWC, Connected Apps OAuth, CDC/event subscription). De 85 skills, restaram 39.

## Skills Salesforce importadas (`salesforce/`)

**Design System (peso máximo — leia antes de qualquer outra skill ao decidir uma tela):** `design-systems-slds-apply`, `design-systems-slds-validate`, `design-systems-slds2-migrate`

Apex: `platform-apex-generate`, `platform-apex-test-generate`

LWC / Experience: `experience-lwc-generate`, `experience-lwc-design-generate`, `experience-lwc-base-components-integrate`, `experience-lwc-accessibility-jest-run`, `experience-lwc-security-validate`, `experience-accessibility-validate`, `experience-lds-best-practices-apply`, `experience-lds-data-requirements-generate`, `experience-lds-graphql-generate`

OmniStudio: `omnistudio-callable-apex-generate`, `omnistudio-datamapper-generate`, `omnistudio-dependencies-analyze`, `omnistudio-flexcard-generate`, `omnistudio-integration-procedure-generate`, `omnistudio-omniscript-generate`

Modelo de dados / metadata / segurança da plataforma: `platform-custom-object-generate`, `platform-custom-field-generate`, `platform-custom-metadata-type-generate`, `platform-custom-setting-generate`, `platform-custom-application-generate`, `platform-custom-tab-generate`, `platform-flexipage-generate`, `platform-lightning-app-coordinate`, `platform-list-view-generate`, `platform-metadata-api-context-get`, `platform-data-manage`, `platform-soql-query`, `platform-sharing-rules-generate`, `platform-sharing-owd-configure`, `platform-permission-set-generate`, `platform-validation-rule-generate`, `platform-value-set-generate`

Integração e automação: `integration-connectivity-generate`, `automation-flow-generate`
