# Constituição do projeto — Migração Service Cloud → Financial Services Cloud

> Este documento registra decisões estruturais válidas para **todas** as jornadas/specs. Specs individuais herdam estas regras e não devem recontestá-las — mudanças aqui exigem decisão explícita do time, não de uma spec isolada.

Status: **rascunho — pendente de preenchimento com o time**

## 1. Modelo de conta

- [NEEDS CLARIFICATION: Person Accounts será habilitado? Isso é irreversível na org — precisa de decisão formal antes de qualquer spec de jornada de cliente.]
- [NEEDS CLARIFICATION: Segmentação Household vs Business Account — todo cliente retail vira Person Account em Household, e clientes PJ continuam como Business Account com Contacts?]

## 2. Licenciamento

- [NEEDS CLARIFICATION: FSC (licenças + managed package) já está provisionado na org destino?]
- [NEEDS CLARIFICATION: OmniStudio está licenciado? Se não, jornadas não podem assumir OmniScript/FlexCard como padrão até isso ser resolvido — ver skill `sf-ux-journey`.]

## 3. Padrão de tecnologia de UI

- Guided/multi-step data capture iterado pelo negócio → OmniScript (se licenciado).
- Painéis de contexto/resumo de registro → FlexCard.
- Lógica complexa, componentes reutilizáveis, cobertura de teste automatizado (Jest) → LWC.
- Ver `.claude/skills/sf-ux-journey/SKILL.md` para o processo completo de decisão por passo de jornada.

## 4. Segurança e compliance

- [NEEDS CLARIFICATION: existe requisito regulatório (ex. LGPD, sigilo bancário) que restringe quem vê Financial Account/Financial Holding? Isso define o modelo de sharing desde a fundação.]
- Sharing rules herdadas do Service Cloud **não** devem ser copiadas 1:1 para objetos FSC sem revalidação.

## 5. Sequenciamento de migração

1. Fundação (Person Accounts/FSC habilitado, modelo de Household/Business, segurança base) — spec própria, pré-requisito de tudo.
2. Migração de dados (Account/Contact → Household/Person Account, objetos legados → Financial Account/Holding).
3. Jornadas (uma spec por jornada de agente/cliente/assessor).
4. Cutover (plano de corte e rollback).

Nenhuma spec de jornada deve ser planejada (`plan.md`) antes da fundação estar com a constituição resolvida (sem `[NEEDS CLARIFICATION]` pendente nas seções 1 e 2).

## 6. Convenções do repositório

- Specs em `specs/NNN-nome-da-jornada/{spec,plan,tasks}.md`.
- Templates em `templates/`.
- Skills de apoio em `.claude/skills/`: `sdd-workflow` (processo), `sf-fsc-migration` (domínio de dados/migração), `sf-ux-journey` (decisão de UI).
