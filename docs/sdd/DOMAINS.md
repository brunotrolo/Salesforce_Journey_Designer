# Domínios (fronteiras de micro-frontend)

O sistema não é monolítico: cada **domínio** abaixo é uma fronteira de produto/negócio que corresponde a uma jornada específica e, no build, a um artefato de UI independentemente implantável (um LWR site/UI Bundle de Experience Cloud, ou um pacote de LWCs — a decisão exata é feita pelo `sf-journey-ux-designer`, mas a fronteira do domínio já define o que pode e o que não pode compartilhar estado/deploy).

Um domínio **não é uma spec** — é uma pasta que agrupa várias specs de **capacidade** (uma tela, um componente, uma etapa de fluxo). Ver `specs/README.md` para a convenção de pastas.

Status: **rascunho — confirmar com o negócio antes de especificar capacidades dentro de um domínio**.

| Domínio (slug) | Nome | Descrição | Depende de |
|---|---|---|---|
| `busca-cliente` | Busca de Cliente | Localizar cliente/conta por CPF, conta, telefone, etc., a partir de qualquer ponto de entrada (Service Cloud, portal, agente). | `_fundacao` 001 |
| `atendimento` | Atendimento | Intake, triagem, resolução e handoff de casos de serviço, com contexto do cliente. | `_fundacao` 001, `busca-cliente` |
| `nbo` | Próxima Melhor Ação | Recomendação da próxima melhor ação/artigo/procedimento para o agente durante um atendimento, com base no contexto do caso. | `_fundacao` 001, `busca-cliente` |
| `gestao-conhecimento` | Gestão de Conhecimento | Criação, curadoria e sugestão automática de artigos de Knowledge durante o atendimento. | `_fundacao` 001, `_fundacao` 002 |
| `onboarding` | Cadastro de Cliente | Registro e verificação de dados de um novo cliente/contato. | `_fundacao` 001 |
| `cliente-360` | Visão 360 do Cliente | Consolidação de casos, ativos (Asset) e histórico de interações do cliente/conta. | `_fundacao` 001, `_fundacao` 002 |
| `self-service` | Portal do Cliente | Jornadas client-facing via Experience Cloud. | `busca-cliente`, `atendimento` |

> Adicione uma linha por domínio conforme o negócio confirma escopo. Cada novo domínio ganha sua própria pasta `specs/<slug>/` e sua própria sequência de numeração `NNN` (começando em 001 dentro do domínio) — a numeração **não** é global entre domínios.

## Domínios vs. Fundação

`_fundacao/` (tabela própria em `docs/sdd/BACKLOG.md`) não é um domínio de produto: é infraestrutura compartilhada (Entitlement/Omni-Channel, Knowledge, segurança) que todo domínio depende. Ela vive fora de `specs/<domínio>/` — em `specs/_fundacao/` — porque não é uma fronteira de micro-frontend, é a base sob todas elas.
