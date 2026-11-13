# Backlog de capacidades — SDD Salesforce Service Cloud

Cada linha é uma **capacidade** (uma tela, um componente, uma etapa de fluxo) — não um domínio inteiro. Ver `docs/sdd/DOMAINS.md` para a lista de domínios e `specs/README.md` para a convenção de pastas (`specs/<domínio>/<NNN>-<slug>/`). Ponto de partida proposto — ajuste com o negócio antes de especificar.

Convenção de status: `não iniciado` → `spec` → `planejado` → `tarefado` → `pronto para build` → `em build` → `concluído`.

## `_fundacao/` (bloqueia todos os domínios)

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Modelo de Entitlement/Milestone e roteamento Omni-Channel (filas, skills, Service Channels), segurança base | Time de plataforma | `docs/sdd/constitution.md` resolvido | não iniciado |
| 002 | Estrutura base de Knowledge (tipos de artigo, categorias de dados) e Macros/Quick Text padrão | Time de atendimento | 001 | não iniciado |

## `busca-cliente/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Busca rápida por CPF/conta/telefone (componente de busca global) | Agente de Serviço | `_fundacao` 001 | não iniciado |
| 002 | Resultado de busca com desambiguação de conta/contato | Agente de Serviço | 001 | não iniciado |

## `atendimento/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Intake e triagem de caso | Agente de Serviço | `busca-cliente` 001 | não iniciado |
| 002 | Tela de resolução de caso com contexto do cliente (via `cliente-360`) | Agente de Serviço | 001, `cliente-360` 001 | não iniciado |
| 003 | Handoff para especialista (escalonamento/Case Swarming) | Agente de Serviço, Especialista | 002 | não iniciado |
| 004 | Disputa/reclamação com checklist de resolução (Flow + Milestone) | Agente de Serviço, Supervisor | 001 | não iniciado |

## `nbo/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Componente de recomendação (card de próxima melhor ação/artigo) exibido durante atendimento | Agente de Serviço | `atendimento` 002 | não iniciado |
| 002 | Registro de aceite/recusa da recomendação e feedback ao motor de recomendação | Agente de Serviço | 001 | não iniciado |

## `gestao-conhecimento/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Criação e curadoria de artigos de Knowledge | Agente de Serviço, Especialista | `_fundacao` 002 | não iniciado |
| 002 | Sugestão automática de artigo relevante durante o atendimento de um caso | Agente de Serviço | 001, `atendimento` 001 | não iniciado |
| 003 | Categorização e ciclo de vida do artigo (revisão, arquivamento) | Especialista | 001 | não iniciado |

## `onboarding/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Registro e verificação de dados de novo cliente/contato | Agente de Serviço, Cliente | `_fundacao` 001 | não iniciado |

## `cliente-360/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Painel consolidado de casos e ativos (Asset) do cliente/conta | Agente de Serviço | `_fundacao` 002 | não iniciado |
| 002 | Gestão de contatos relacionados à conta | Agente de Serviço | 001 | não iniciado |
| 003 | Acompanhamento de SLA e satisfação do cliente (Milestone, CSAT) | Agente de Serviço, Especialista | 001 | não iniciado |

## `self-service/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Solicitação de serviço via portal do cliente | Cliente | `busca-cliente` 001, `atendimento` 001 | não iniciado |

## Cutover (cross-domínio, não vive em `specs/`)

| Item | Depende de | Status |
|---|---|---|
| Plano de corte, reconciliação e rollback | Todas as capacidades em build | não iniciado |

## Como usar

1. Revise com o negócio: confirme os domínios em `docs/sdd/DOMAINS.md` e as capacidades desta tabela antes de especificar.
2. Peça ao `sf-sdd-orchestrator` por domínio + capacidade (ex.: "inicie a spec de `atendimento` 001 — intake e triagem de caso"). Ele resolve a fundação antes de qualquer capacidade de domínio.
3. Status é atualizado pelo orquestrador ao fim de cada etapa do ciclo, nesta tabela.
4. Por padrão (constituição, Princípio IV), toda capacidade parte da hipótese de ser **100% padrão/declarativo**. Customização (LWC) só entra onde o padrão comprovadamente não cobre — o orquestrador para para confirmação sempre que uma capacidade sair da classificação padrão. Vale acrescentar essa classificação (padrão/misto/customizado) nesta tabela conforme cada capacidade é planejada, para dar visibilidade de quanto do sistema está saindo do padrão.
5. Todo desenho de tela consome `docs/design-system/SYSTEM-DESIGN.md` (fundação visual única do projeto, gate leve — constituição Princípio II) e gera um protótipo LWC real (sobre SLDS2 real, via `.claude/skills/salesforce-ux/design-system-2-starter-kit/`) em `specs/<domínio>/<NNN>/prototype/`, que o negócio precisa confirmar antes do plano técnico ser gerado (gate rígido — constituição Princípio VIII). Se o System Design ainda não estiver ratificado, isso fica registrado em `plan.md`, não escondido.
6. Toda capacidade "pronta para build" tem um `architecture.md` — mapa de todo artefato de `tasks.md` e suas conexões (chama/lê/escreve/consumido por) — para que um agente diferente, sem contexto desta conversa, consiga construir a capacidade só com os arquivos da pasta (constituição Princípio IX, NON-NEGOTIABLE).
