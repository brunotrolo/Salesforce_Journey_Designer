# Salesforce Service Cloud — Constitution

Status: **rascunho — pendente de decisão do time nos itens marcados `[NEEDS CLARIFICATION]`**

Toda capacidade especificada em `specs/<domínio>/` (ver `docs/sdd/DOMAINS.md`) herda estas regras. Uma spec individual não deve recontestá-las — mudanças aqui exigem decisão explícita do time, feita uma vez, não capacidade a capacidade.

## Core Principles

### I. Fundação de atendimento antes de qualquer domínio
Nenhuma capacidade de domínio é planejada (`plan.md`) antes de o modelo de **Record Types de Case** (quais tipos de caso existem e qual processo de suporte/page layout cada um usa), **Assignment/Escalation Rules**, o modelo de **Entitlement/Milestone** (processo de SLA por tipo de caso) e o modelo de **roteamento Omni-Channel** (quais Service Channels, filas e skills distribuem o trabalho a agentes) estarem resolvidos nas seções abaixo. Planejar capacidades de atendimento sobre um modelo de Record Type/SLA/roteamento ainda não decidido é a causa mais comum de retrabalho — toda tela de caso, toda fila, toda automação de atendimento depende dessa decisão — por isso `specs/_fundacao/` bloqueia todo domínio, não só um. Este gate é **rígido**.

### II. Fundação de design única antes de telas (gate leve)
Assim como a fundação de atendimento é fundação para toda capacidade, o **System Design** (`docs/design-system/SYSTEM-DESIGN.md`, mantido por `sf-design-system-architect`) é a fundação visual: tokens, inventário de componentes padrão e catálogo fechado de padrões customizados aprovados, únicos para todo o projeto — nenhuma capacidade ou domínio inventa seu próprio estilo. Diferente da Regra I, este gate é **leve**: uma capacidade pode ser desenhada antes de o System Design estar ratificado, mas `sf-journey-ux-designer` deve registrar isso explicitamente em `plan.md` (não silenciar a inconsistência) e o `sf-sdd-orchestrator` avisa o usuário sem bloquear.

### III. Spec sem vazamento de implementação
`spec.md` descreve o quê e o porquê em linguagem de negócio. Nomes de objeto, campo ou componente LWC só aparecem a partir de `plan.md`. Ambiguidade vira `[NEEDS CLARIFICATION: pergunta]`, nunca uma suposição silenciosa.

### IV. Padrão e declarativo primeiro (NON-NEGOTIABLE)
Over-customização é a causa mais comum de problemas de sustentação numa org Salesforce. Toda capacidade parte da hipótese de que os recursos **padrão e declarativos** do Service Cloud (Lightning App Builder com Dynamic Forms, Related Record/Highlights Panel, page layouts, list views, related lists, ações padrão/Macros, Screen Flow — opcionalmente exposto via Flow for Service) resolvem a necessidade. Customização (LWC, Apex) é **exceção que precisa de justificativa registrada em `plan.md`**, não ponto de partida. Toda capacidade é classificada em `plan.md` como **100% padrão/declarativo**, **misto** ou **100% customizado** — essa classificação é verificada pelo `sf-sdd-orchestrator` (gate **rígido**) antes de avançar, e uma classificação "misto" ou "100% customizado" exige a justificativa de por que o padrão não bastou, mais confirmação explícita do usuário.

### V. Tecnologia de UI decidida por pergunta, não por preferência (NON-NEGOTIABLE)
Quando a Regra IV já concluiu que uma customização é necessária, a escolha entre LWC e Screen Flow (ou híbrido) é feita por passo de capacidade, seguindo o processo do agente `sf-journey-ux-designer` (exibição de registro → iteração pelo negócio sem deploy → lógica complexa → orquestração de backend → Experience Cloud). Nunca "porque o time já sabe LWC" — e nunca como primeira opção sem antes descartar o padrão/declarativo pela Regra IV, nem sem escolher dentro do catálogo aprovado pela Regra II.

### VI. Modelo de dados padrão do Service Cloud, não objeto customizado por conveniência
Novo objeto ou campo customizado só é criado depois de confirmar que os objetos padrão do Service Cloud (Account, Contact, Case, Entitlement, Milestone, Asset, Knowledge Article, Omni-Channel — ServiceChannel, Queue, SkillRequirement — Macro, Quick Text) genuinamente não cobrem a necessidade. `sf-journey-tech-planner` registra essa checagem em `plan.md` antes de propor qualquer objeto/campo novo — o objetivo é uma org sustentável, não customização por conveniência.

### VII. Segurança revalidada, não copiada
Sharing rules, OWD e permission sets nunca são copiados de uma capacidade ou projeto anterior sem revalidação — cada capacidade revalida o modelo de sharing contra a sensibilidade real do dado que ela toca.

### VIII. Protótipo valida antes do plano técnico (NON-NEGOTIABLE)
Depois que `sf-journey-ux-designer` desenha as telas de uma capacidade, `sf-html-prototyper` constrói um protótipo **LWC real**, rodando sobre SLDS2 real, no ambiente vendorizado `.claude/skills/salesforce-ux/design-system-2-starter-kit/` (ver `.claude/skills/salesforce-ux/README.md`), cobrindo todos os cenários de aceite do `spec.md` — não uma aproximação em HTML/CSS estático, mas Lightning Web Components de verdade renderizando sobre a mesma engine de estilo (SLDS2) usada em produção. O `sf-sdd-orchestrator` apresenta esse protótipo ao usuário e exige confirmação explícita de que ele corresponde ao esperado — **gate rígido** — antes de acionar `sf-journey-tech-planner`. O objetivo é errar barato: um ajuste de spec ou de tela descoberto no protótipo custa uma revisão de documento; o mesmo ajuste descoberto depois de `tasks.md` custa retrabalho de build. **A única exceção é `specs/_fundacao/`**: por não ter UI, não passa por `sf-journey-ux-designer`/`sf-html-prototyper` — vai direto de `spec.md` confirmado para `sf-journey-tech-planner`.

### IX. Rastreabilidade spec → plan → tasks → architecture (NON-NEGOTIABLE)
Todo cenário de aceite em `spec.md` tem pelo menos uma task em `tasks.md` e (exceto em `specs/_fundacao/`, que não tem UI) um caminho navegável no protótipo da capacidade; toda task nomeia um artefato Salesforce concreto. Além disso, todo artefato de `tasks.md` tem uma linha em `architecture.md` (mapa de artefatos e conexões — quem chama, lê, escreve e consome cada um), produzida pelo `sf-journey-tech-planner`. O critério de "pronto para build" não é só ter os documentos — é que um agente novo, sem nenhum contexto desta conversa, consiga construir a capacidade só com eles (`spec.md` + `plan.md` + `tasks.md` + `architecture.md`, mais `prototype/` quando aplicável), sem precisar rededuzir uma conexão. O agente orquestrador (`sf-sdd-orchestrator`) verifica essa correspondência antes de marcar uma capacidade como pronta para build.

## Fundação de atendimento

- [NEEDS CLARIFICATION: quais Record Types de Case existem e qual processo de suporte/page layout cada um usa? Decisão formal do time antes de qualquer spec de capacidade de atendimento.]
- [NEEDS CLARIFICATION: existem Assignment Rules e Escalation Rules definidas, ou a distribuição/escalonamento é inteiramente via Omni-Channel? As duas podem coexistir — registrar qual decide o quê.]
- [NEEDS CLARIFICATION: Entitlement Management está habilitado? Qual a estrutura de Milestone por tipo de caso (ex.: primeira resposta, resolução)? Decisão formal do time antes de qualquer spec de capacidade de atendimento.]
- [NEEDS CLARIFICATION: modelo de roteamento Omni-Channel — quais Service Channels existem, quais filas/skills distribuem o trabalho a agentes?]

## Segurança e compliance

- [NEEDS CLARIFICATION: existe requisito regulatório (LGPD, setor específico) que restringe quem vê determinado caso/conta? Isso define o modelo de sharing desde a fundação.]

## Sequenciamento

1. **Fundação** — Record Types de Case, Assignment/Escalation Rules, modelo de Entitlement/Milestone, roteamento Omni-Channel, estrutura base de Knowledge, segurança base. Vive em `specs/_fundacao/<NNN>-<slug>/` (não é um domínio de produto), pré-requisito de todos os domínios em `docs/sdd/DOMAINS.md`.
2. **Domínios** — uma spec por capacidade (tela/componente/etapa de fluxo), agrupada por domínio (ver `docs/sdd/DOMAINS.md` e `docs/sdd/BACKLOG.md`).
3. **Cutover** — plano de corte e rollback para capacidades que substituem um processo existente, cross-domínio (ver `docs/sdd/BACKLOG.md`).

Em paralelo a essa sequência, existe uma trilha de UI: o **System Design** (`docs/design-system/SYSTEM-DESIGN.md`) idealmente é ratificado antes ou durante a onda 1, mas — por ser gate leve (Princípio II) — não bloqueia o início dos domínios como a fundação de atendimento bloqueia (Princípio I, gate rígido).

## Governance

Esta constituição prevalece sobre decisões tomadas dentro de uma spec individual. Alterações aqui exigem: (1) registro da mudança e motivo neste arquivo, (2) verificação de impacto nas capacidades já planejadas/em build listadas em `docs/sdd/BACKLOG.md`, em qualquer domínio. Os cinco agentes especialistas (`sf-design-system-architect`, `sf-journey-spec-writer`, `sf-journey-ux-designer`, `sf-html-prototyper`, `sf-journey-tech-planner`) e o orquestrador (`sf-sdd-orchestrator`) tratam este arquivo como fonte de verdade para fundação de atendimento, System Design, padrão-primeiro, validação por protótipo e sequenciamento.

**Version**: 0.1.0 (rascunho) | **Ratified**: pendente | **Last Amended**: pendente
