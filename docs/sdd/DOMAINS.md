# Domínios (fronteiras de micro-frontend)

O sistema não é monolítico: cada **domínio** abaixo é uma fronteira de produto/negócio que corresponde a uma jornada específica e, no build, a um artefato de UI independentemente implantável (um LWR site/UI Bundle de Experience Cloud, um conjunto de OmniScripts+FlexCards, ou um pacote de LWCs — a decisão exata é feita pelo `fsc-journey-ux-designer`, mas a fronteira do domínio já define o que pode e o que não pode compartilhar estado/deploy).

Um domínio **não é uma spec** — é uma pasta que agrupa várias specs de **capacidade** (uma tela, um componente, uma etapa de fluxo). Ver `specs/README.md` para a convenção de pastas.

Status: **rascunho — confirmar com o negócio antes de especificar capacidades dentro de um domínio**.

| Domínio (slug) | Nome | Descrição | Depende de |
|---|---|---|---|
| `busca-cliente` | Busca de Cliente | Localizar cliente/household por CPF, conta, telefone, etc., a partir de qualquer ponto de entrada (Service Cloud, portal, agente). | `_fundacao` 001 |
| `atendimento` | Atendimento | Intake, triagem, resolução e handoff de casos de serviço, com contexto financeiro do cliente. | `_fundacao` 001, `busca-cliente` |
| `nbo` | Next Best Offer | Recomendação de próxima melhor oferta/ação para o cliente durante um atendimento ou jornada de relacionamento. | `_fundacao` 001, `busca-cliente` |
| `produto-consorcio` | Produto Consórcio | Jornadas específicas do produto Consórcio (contratação, gestão de cota, contemplação, atendimento especializado). | `_fundacao` 001, `busca-cliente` |
| `onboarding` | Onboarding | Abertura de conta / KYC de novo cliente. | `_fundacao` 001 |
| `household-360` | Visão 360 do Household | Consolidação de contas financeiras, holdings e relacionamentos do household. | `_fundacao` 001, `_fundacao` 002 |
| `self-service` | Portal do Cliente | Jornadas client-facing via Experience Cloud. | `busca-cliente`, `atendimento` |

> Adicione uma linha por domínio conforme o negócio confirma escopo. Cada novo domínio ganha sua própria pasta `specs/<slug>/` e sua própria sequência de numeração `NNN` (começando em 001 dentro do domínio) — a numeração **não** é global entre domínios.

## Domínios vs. Fundação

`_fundacao/` (tabela própria em `docs/sdd/BACKLOG.md`) não é um domínio de produto: é infraestrutura compartilhada (modelo de dados, segurança, migração) que todo domínio depende. Ela vive fora de `specs/<domínio>/` — em `specs/_fundacao/` — porque não é uma fronteira de micro-frontend, é a base sob todas elas.
