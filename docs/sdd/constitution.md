# Migração Service Cloud → Financial Services Cloud — Constitution

<!-- Instanciado a partir de .claude/skills/spec-kit/templates/constitution-template.md -->

Status: **rascunho — pendente de decisão do time nos itens marcados `[NEEDS CLARIFICATION]`**

Toda capacidade especificada em `specs/<domínio>/` (ver `docs/sdd/DOMAINS.md`) herda estas regras. Uma spec individual não deve recontestá-las — mudanças aqui exigem decisão explícita do time, feita uma vez, não capacidade a capacidade.

## Core Principles

### I. Fundação de dados antes de qualquer domínio
Nenhuma capacidade de domínio é planejada (`plan.md`) antes de o modelo de conta (Person Accounts/Household vs Business Account) e o licenciamento (FSC, OmniStudio) estarem resolvidos nas seções abaixo. Planejar uma capacidade sobre um modelo de dados ainda não decidido é a causa mais comum de retrabalho em migrações para FSC — por isso `specs/_fundacao/` bloqueia todo domínio, não só um.

### II. Spec sem vazamento de implementação
`spec.md` descreve o quê e o porquê em linguagem de negócio. Nomes de objeto, campo, componente LWC, OmniScript ou FlexCard só aparecem a partir de `plan.md`. Ambiguidade vira `[NEEDS CLARIFICATION: pergunta]`, nunca uma suposição silenciosa.

### III. Padrão e declarativo primeiro (NON-NEGOTIABLE)
Um dos motivos desta migração é que a org atual é excessivamente customizada e isso gera problemas de sustentação. Essa lição não se repete na org nova: toda capacidade parte da hipótese de que os recursos **padrão e declarativos** do FSC (Lightning App Builder com componentes padrão/dinâmicos, page layouts, list views, related lists, ações padrão, Flow declarativo sem Apex/LWC embutido, objetos e campos padrão do FSC) resolvem a necessidade. Customização (LWC, FlexCard, OmniScript, Apex) é **exceção que precisa de justificativa registrada em `plan.md`**, não ponto de partida. Toda capacidade é classificada em `plan.md` como **100% padrão/declarativo**, **misto** ou **100% customizado** — essa classificação é verificada pelo `fsc-sdd-orchestrator` antes de avançar para `tasks.md`, e uma classificação "misto" ou "100% customizado" exige a justificativa de por que o padrão não bastou.

### IV. Tecnologia de UI decidida por pergunta, não por preferência (NON-NEGOTIABLE)
Quando a Regra III já concluiu que uma customização é necessária, a escolha entre LWC, OmniScript, FlexCard ou híbrido é feita por passo de capacidade, seguindo o processo do agente `fsc-journey-ux-designer` (licenciamento → iteração pelo negócio → exibição de registro → lógica complexa → orquestração → Experience Cloud). Nunca "porque é o padrão FSC" nem "porque o time já sabe LWC" — e nunca como primeira opção sem antes descartar o padrão/declarativo pela Regra III.

### V. Modelo de dados padrão do FSC, não objeto customizado por conveniência
Novo objeto ou campo customizado só é criado depois de confirmar que os objetos padrão do FSC (Household, Financial Account, Financial Account Role, Financial Holding, Financial Goal, Relationship Groups) genuinamente não cobrem a necessidade. `fsc-journey-tech-planner` registra essa checagem em `plan.md` antes de propor qualquer objeto/campo novo — o objetivo é uma org sustentável, não uma cópia customizada da org de origem sobre o rótulo FSC.

### VI. Segurança revalidada, não copiada
Sharing rules, OWD e permission sets do Service Cloud não são copiados 1:1 para os objetos FSC (Household, Financial Account, Relationship Groups) sem revalidação — dado financeiro tem exigência de compliance própria.

### VII. Rastreabilidade spec → plan → tasks
Todo cenário de aceite em `spec.md` tem pelo menos uma task em `tasks.md`; toda task nomeia um artefato Salesforce concreto. O agente orquestrador (`fsc-sdd-orchestrator`) verifica essa correspondência antes de marcar uma capacidade como pronta para build.

## Modelo de conta

- [NEEDS CLARIFICATION: Person Accounts será habilitado na org destino? É uma configuração irreversível — decisão formal do time antes de qualquer spec de capacidade de domínio voltada a cliente.]
- [NEEDS CLARIFICATION: Segmentação — todo cliente retail vira Person Account em Household, e clientes PJ continuam como Business Account com Contacts?]

## Licenciamento

- [NEEDS CLARIFICATION: FSC (managed package + licenças) já está provisionado na org destino?]
- [NEEDS CLARIFICATION: OmniStudio está licenciado? Enquanto não confirmado, `fsc-journey-ux-designer` deve assumir LWC por padrão em vez de OmniScript/FlexCard.]

## Segurança e compliance

- [NEEDS CLARIFICATION: existe requisito regulatório (LGPD, sigilo bancário) que restringe quem vê Financial Account/Financial Holding? Isso define o modelo de sharing desde a fundação.]

## Sequenciamento de migração

1. **Fundação** — Person Accounts/FSC habilitado, modelo de Household/Business, segurança base. Vive em `specs/_fundacao/<NNN>-<slug>/` (não é um domínio de produto), pré-requisito de todos os domínios em `docs/sdd/DOMAINS.md`.
2. **Migração de dados** — Account/Contact → Household/Person Account; objetos legados → Financial Account/Holding. Também em `specs/_fundacao/`.
3. **Domínios** — uma spec por capacidade (tela/componente/etapa de fluxo), agrupada por domínio (ver `docs/sdd/DOMAINS.md` e `docs/sdd/BACKLOG.md`).
4. **Cutover** — plano de corte e rollback, cross-domínio (ver `docs/sdd/BACKLOG.md`).

## Governance

Esta constituição prevalece sobre decisões tomadas dentro de uma spec individual. Alterações aqui exigem: (1) registro da mudança e motivo neste arquivo, (2) verificação de impacto nas capacidades já planejadas/em build listadas em `docs/sdd/BACKLOG.md`, em qualquer domínio. Os três agentes especialistas (`fsc-journey-spec-writer`, `fsc-journey-ux-designer`, `fsc-journey-tech-planner`) e o orquestrador (`fsc-sdd-orchestrator`) tratam este arquivo como fonte de verdade para modelo de conta, licenciamento, padrão-primeiro e sequenciamento.

**Version**: 0.1.0 (rascunho) | **Ratified**: pendente | **Last Amended**: pendente
