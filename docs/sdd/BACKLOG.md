# Backlog de jornadas — SDD Service Cloud → FSC

Lista de jornadas a especificar via os agentes em `.claude/agents/`. É um **ponto de partida proposto**, com base em jornadas típicas de uma migração Service Cloud → Financial Services Cloud — não é o escopo confirmado do seu negócio. Ajuste linhas, adicione/remova jornadas, e confirme prioridade antes de rodar `fsc-sdd-orchestrator` em cada uma.

Convenção de status: `não iniciado` → `spec` → `planejado` → `tarefado` → `pronto para build` → `em build` → `concluído`.

## Onda 0 — Fundação (bloqueia todas as jornadas abaixo)

| ID | Jornada | Persona | Depende de | Status |
|---|---|---|---|---|
| 000 | Fundação de dados e segurança (Person Accounts/Household, modelo de sharing base, licenciamento FSC/OmniStudio) | Time de plataforma | `docs/sdd/constitution.md` resolvido | não iniciado |
| 001 | Migração de dados legados (Account/Contact/Case → Household/Person Account; objetos legados → Financial Account/Holding) | Time de dados | 000 | não iniciado |

## Onda 1 — Jornadas de cliente/agente (core service)

| ID | Jornada | Persona | Depende de | Status |
|---|---|---|---|---|
| 002 | Visão 360 do cliente/household (contexto financeiro consolidado ao abrir um registro) | Agente de Serviço | 000, 001 | não iniciado |
| 003 | Intake e triagem de caso de serviço | Agente de Serviço | 000, 002 | não iniciado |
| 004 | Atendimento e resolução de caso com contexto financeiro | Agente de Serviço | 003 | não iniciado |
| 005 | Consulta de contas financeiras e holdings do cliente | Agente de Serviço, Assessor | 001, 002 | não iniciado |

## Onda 2 — Jornadas de onboarding e relacionamento

| ID | Jornada | Persona | Depende de | Status |
|---|---|---|---|---|
| 006 | Onboarding de novo cliente (KYC / abertura de conta) | Agente de Serviço, Cliente | 000 | não iniciado |
| 007 | Gestão de relacionamentos do household (quem mais compõe o household — cônjuge, beneficiário, sócio) | Agente de Serviço, Assessor | 001 | não iniciado |
| 008 | Definição e acompanhamento de metas financeiras (Financial Goals) | Assessor, Cliente | 005 | não iniciado |
| 009 | Handoff entre agente de serviço e assessor financeiro | Agente de Serviço, Assessor | 004, 005 | não iniciado |

## Onda 3 — Self-service e exceções

| ID | Jornada | Persona | Depende de | Status |
|---|---|---|---|---|
| 010 | Solicitação de serviço via portal do cliente (Experience Cloud) | Cliente | 002, 003 | não iniciado |
| 011 | Disputa/reclamação com Action Plan | Agente de Serviço, Compliance | 003, 000 | não iniciado |

## Onda 4 — Cutover

| ID | Jornada | Persona | Depende de | Status |
|---|---|---|---|---|
| 012 | Plano de corte, reconciliação e rollback | Time de plataforma | Todas as jornadas em build | não iniciado |

## Como usar

1. Revise esta lista com o time de negócio — renomeie, remova ou adicione jornadas antes de especificar.
2. Peça ao `fsc-sdd-orchestrator` para iniciar por ID ou nome (ex.: "inicie a spec da jornada 003 — intake de caso"). Ele verifica a fundação (000) e a constituição antes de prosseguir para qualquer jornada das ondas 1–4.
3. Atualize a coluna Status conforme cada jornada avança — o orquestrador faz isso automaticamente ao fim de cada etapa do ciclo.
