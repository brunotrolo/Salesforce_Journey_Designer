# Spec — `household-360/001` — Visão 360° do cliente Porto Bank

| Campo | Valor |
|---|---|
| **Domínio** | `household-360` — Visão 360 do Household (ver `docs/sdd/DOMAINS.md`) |
| **Capacidade** | 001 — Painel consolidado de contas financeiras e holdings (visão 360° do cliente) |
| **Slug** | `001-visao-360-cliente` |
| **Status** | spec — base criada, aguardando especificação detalhada do negócio |
| **BACKLOG** | Corresponde a `BACKLOG.md#household-360/001` ("Painel consolidado de contas financeiras e holdings do household") |

> **Caveats de fundação (gates):**
> - `_fundacao/001` (modelo de conta e segurança base) em **não iniciado** (gate rígido, Princípio I). Esta capacidade depende dele de forma ainda mais direta que `busca-cliente/001`: a modelagem padrão FSC (Person Account? Household? pacote `FinServ__*` provisionado?) precisa estar decidida antes do `plan.md` técnico. Prosseguimento exploratório somente com autorização.
> - `_fundacao/002` (migração de dados) é dependência declarada no BACKLOG para esta capacidade.
> - `docs/design-system/SYSTEM-DESIGN.md` em **não iniciado** (gate leve, Princípio II).

---

## 1. Contexto

A partir da jornada de `busca-cliente/001` — onde o operador identifica o cliente e fixa o contexto de interação (cliente + produto + via/cota/posição) — surge a necessidade de uma visão consolidada do cliente: ao clicar no **nome do cliente** no cartão de identificação, o operador abre uma **página nova e 100% independente** com a visão 360° do cliente Porto Bank.

Diferente da busca (construída sobre objetos core `Account+Contact` sem o pacote FSC, por decisão exploratória), esta jornada nasce com a diretriz explícita de usar o **modelo padrão do Salesforce**: objeto `Account` e **tabelas/componentes padrão do Financial Services Cloud**, com cards compondo a visão 360°.

## 2. Objetivo (preliminar — aguardando especificação detalhada)

Permitir que o operador, a partir do clique no nome do cliente identificado, navegue para uma página independente com a visão 360° do cliente — contas financeiras, holdings, relacionamento e alertas — montada sobre objetos e componentes padrão FSC, sem acoplar à jornada de busca (a única ponte entre elas é o contexto de interação já fixado: documento do cliente).

## 3. Escopo (preliminar)

### Dentro (proposto, a confirmar)
- Nova rota/página independente (app próprio ou aba do console), alcançável pelo clique no nome do cliente.
- Cards de visão 360° sobre objetos padrão FSC (contas financeiras, holdings, papéis/relacionamentos).
- Leitura do contexto de interação fixado em `busca-cliente/001` como entrada (documento do cliente).

### Fora (proposto, a confirmar)
- Edição de dados nesta página (somente leitura na v1, a confirmar).
- Transações sobre os produtos (pertencem às jornadas transacionais futuras).
- Modelo de dados customizado — Princípio VI: só padrão FSC (a confirmar contra `_fundacao/001`).

## 4. Cenários de aceite

[NEEDS CLARIFICATION: cenários serão escritos a partir da especificação detalhada a ser enviada pelo negócio.]

## 5. Regras de negócio

[NEEDS CLARIFICATION: regras serão extraídas da especificação detalhada.]

## 6. Casos limite e edge cases

[NEEDS CLARIFICATION.]

## 7. Dados envolvidos (em termos de negócio, não técnicos)

[NEEDS CLARIFICATION: a confirmar — expectativa: contas financeiras, holdings, relacionamentos, alertas/ofertas ativas.]

## 8. Dependências

| Dependência | Tipo | Situação | Impacto nesta spec |
|---|---|---|---|
| `_fundacao/001` — Modelo de conta e segurança base | Fundação (gate rígido) | **Não iniciado** | Decide Person Account/Household/`FinServ__*` — pré-requisito do `plan.md` técnico. Sem isso, só spec/UX exploratória. |
| `_fundacao/002` — Migração de dados | Fundação | **Não iniciado** | Base consolidada para a visão 360° ler. |
| `busca-cliente/001` — contexto fixado | Domínio produtor (local, gitignored) | Protótipo validado | Fornece o documento do cliente + produto/via/cota/posição como entrada via dado (nunca via componente compartilhado). O clique no nome do cliente é o gatilho de navegação. |
| `docs/design-system/SYSTEM-DESIGN.md` | Fundação visual (gate leve) | **Não iniciado** | Cards seguem SLDS2 verificado até ratificação. |

## 9. Perguntas em aberto — [NEEDS CLARIFICATION]

1. [NEEDS CLARIFICATION: especificação detalhada da visão 360° — quais cards, em que ordem, com quais dados e ações? (Aguardando envio do negócio.)]
2. [NEEDS CLARIFICATION: a página vive em app próprio, aba do console ou overlay?]
3. [NEEDS CLARIFICATION: somente leitura na v1 ou há edição/ações por card?]
4. [NEEDS CLARIFICATION: modelo FSC exato — quais objetos padrão (`FinancialAccount`, `FinancialHolding`, `FinancialAccountRole`, outros) e como o clique no nome transporta o contexto (rota com parâmetro, evento, outro)?]

## 10. Notas para as próximas fases

- Esta base foi criada antes da especificação detalhada a pedido do solicitante; nada aqui é decisão final.
- Quando a especificação chegar: `fsc-journey-spec-writer` completa §§4–7/§9 → `fsc-journey-ux-designer` desenha telas (standard/declarativo primeiro, Princípio IV) → `fsc-html-prototyper` constrói `prototype/` (fonte única, overlay temporário, componentes decompostos) → `fsc-journey-tech-planner` detalha `plan.md` §§11+/`tasks.md`/`architecture.md` — mas o técnico só fecha após `_fundacao/001`.

---

*Fim de `spec.md` — `household-360/001` (base; aguardando especificação detalhada)*
