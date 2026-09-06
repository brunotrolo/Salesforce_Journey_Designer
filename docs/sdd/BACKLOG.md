# Backlog de capacidades — SDD Service Cloud → FSC

Cada linha é uma **capacidade** (uma tela, um componente, uma etapa de fluxo) — não um domínio inteiro. Ver `docs/sdd/DOMAINS.md` para a lista de domínios e `specs/README.md` para a convenção de pastas (`specs/<domínio>/<NNN>-<slug>/`). Ponto de partida proposto — ajuste com o negócio antes de especificar.

Convenção de status: `não iniciado` → `spec` → `planejado` → `tarefado` → `pronto para build` → `em build` → `concluído`.

## `_fundacao/` (bloqueia todos os domínios)

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Modelo de dados e segurança base (Person Accounts/Household, sharing base, licenciamento FSC/OmniStudio) | Time de plataforma | `docs/sdd/constitution.md` resolvido | não iniciado |
| 002 | Migração de dados legados (Account/Contact/Case → Household/Person Account; objetos legados → Financial Account/Holding) | Time de dados | 001 | não iniciado |

## `busca-cliente/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Busca rápida por CPF/conta/telefone (componente de busca global) | Agente de Serviço | `_fundacao` 001 | não iniciado |
| 002 | Resultado de busca com desambiguação de household | Agente de Serviço | 001 | não iniciado |

## `atendimento/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Intake e triagem de caso | Agente de Serviço | `busca-cliente` 001 | não iniciado |
| 002 | Tela de resolução de caso com contexto financeiro (via `household-360`) | Agente de Serviço | 001, `household-360` 001 | não iniciado |
| 003 | Handoff para assessor financeiro | Agente de Serviço, Assessor | 002 | não iniciado |
| 004 | Disputa/reclamação com Action Plan | Agente de Serviço, Compliance | 001 | não iniciado |

## `nbo/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Componente de recomendação (card de próxima melhor oferta) exibido durante atendimento | Agente de Serviço | `atendimento` 002 | não iniciado |
| 002 | Registro de aceite/recusa da oferta e feedback ao motor de recomendação | Agente de Serviço | 001 | não iniciado |

## `produto-consorcio/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Contratação de cota de consórcio | Agente de Serviço, Cliente | `busca-cliente` 001, `onboarding` 001 | não iniciado |
| 002 | Consulta e gestão de cota (situação, parcelas, lance) | Agente de Serviço, Cliente | 001 | não iniciado |
| 003 | Atendimento especializado de contemplação | Agente de Serviço | 002 | não iniciado |

## `onboarding/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Abertura de conta / KYC | Agente de Serviço, Cliente | `_fundacao` 001 | não iniciado |

## `household-360/`

| ID | Capacidade | Persona | Depende de | Status |
|---|---|---|---|---|
| 001 | Painel consolidado de contas financeiras e holdings do household | Agente de Serviço, Assessor | `_fundacao` 002 | não iniciado |
| 002 | Gestão de relacionamentos do household (cônjuge, beneficiário, sócio) | Agente de Serviço, Assessor | 001 | não iniciado |
| 003 | Definição e acompanhamento de metas financeiras | Assessor, Cliente | 001 | não iniciado |

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
2. Peça ao `fsc-sdd-orchestrator` por domínio + capacidade (ex.: "inicie a spec de `atendimento` 001 — intake e triagem de caso"). Ele resolve a fundação antes de qualquer capacidade de domínio.
3. Status é atualizado pelo orquestrador ao fim de cada etapa do ciclo, nesta tabela.
4. Por padrão (constituição, Princípio IV), toda capacidade parte da hipótese de ser **100% padrão/declarativo**. Customização (LWC/OmniScript/FlexCard) só entra onde o padrão comprovadamente não cobre — o orquestrador para para confirmação sempre que uma capacidade sair da classificação padrão. Vale acrescentar essa classificação (padrão/misto/customizado) nesta tabela conforme cada capacidade é planejada, para dar visibilidade de quanto do sistema está saindo do padrão.
5. Todo desenho de tela consome `docs/design-system/SYSTEM-DESIGN.md` (fundação visual única do projeto, gate leve — constituição Princípio II) e gera um protótipo LWC real (sobre SLDS2 real, via `tools/prototype-studio/`) em `specs/<domínio>/<NNN>/prototype/`, que o negócio precisa confirmar antes do plano técnico ser gerado (gate rígido — constituição Princípio VIII). Se o System Design ainda não estiver ratificado, isso fica registrado em `plan.md`, não escondido.
6. Toda capacidade "pronta para build" tem um `architecture.md` — mapa de todo artefato de `tasks.md` e suas conexões (chama/lê/escreve/consumido por) — para que um agente diferente, sem contexto desta conversa, consiga construir a capacidade só com os arquivos da pasta (constituição Princípio IX, NON-NEGOTIABLE).
