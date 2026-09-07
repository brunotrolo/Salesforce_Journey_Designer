# Plan — `household-360/001` — Visão 360° do cliente Porto Bank

| Campo | Valor |
|---|---|
| **Domínio** | `household-360` — Visão 360 do Household |
| **Capacidade** | 001 — Painel consolidado (visão 360° do cliente) |
| **Slug** | `001-visao-360-cliente` |
| **Status** | planejado — protótipo construído e validado tecnicamente (build exit 0, linter 0 erros, scorecard A, preview 200 em `/visao-360`); aguardando confirmação do negócio (gate VIII) |
| **Spec** | `specs/household-360/001-visao-360-cliente/spec.md` (16 cenários, 1× [NEEDS CLARIFICATION]) |
| **Constitution gates** | Princípio I (fundação `_fundacao/001` não iniciada — exploração autorizada), Princípio II (System Design não iniciado — gate leve), Princípios IV/V/VI NON-NEGOTIABLE aplicados passo a passo |
| **System Design** | `docs/design-system/SYSTEM-DESIGN.md` — **não iniciado** |
| **Decisões de arquitetura de origem** | `visao360.md` (local, gitignored) — página independente na Account raiz, 3 colunas, padrão FSC máximo (Highlights, ARC, FlexCards, Related List), Apex só na orquestração/integração sem IPs, NBO com motor externo + idempotência por safra, voláteis sob demanda sem persistir |

> Este `plan.md` cobre UX/UI (§§1–10, papel `fsc-journey-ux-designer`) + complemento técnico (§§11–17, papel `fsc-journey-tech-planner`). Nomes `c-*`/`FSC*` aqui são decisões de build; o protótipo usa equivalentes LWC no kit (tabela §8).

---

## 1. Tabela de passos — linguagem de negócio (16 cenários → 9 passos + 2 transversais)

| Passo | Persona | Gatilho | Dados lidos | Dados gravados | Pontos de decisão | Condição de saída | Cenários |
|---|---|---|---|---|---|---|---|
| **P0 — Entrada pela busca** | Operador | Clique no nome do cliente no cartão da `busca-cliente/001` | Contexto fixado (documento) | Nenhum (navegação) | — | Página 360° aberta com o cliente como raiz, sem redigitação | 1 |
| **P1 — Faixa de destaques** | Operador (leitura) | Abertura da página | Nome, documento mascarado, segmento, saldo consolidado, alertas risco/fraude | Nenhum | Alerta presente vs. ausente | Topo renderizado com skeleton enquanto carrega | 2 |
| **P2 — Resumo cadastral** | Operador (leitura) | Abertura da página | Contatos, telefones, e-mail, situação cadastral, score | Nenhum | Dado disponível vs. ausente | Bloco de perfil renderizado | 3 |
| **P3 — Árvore de relacionamentos** | Operador (leitura/exploração) | Abertura (resumida) + "Ver árvore completa" (modal) | Vínculos 1º nível; multinível no modal + detalhe do nó | Nenhum | Resumida (≤5 nós) vs. completa (≤20 + paginação); clique em nó PJ troca a raiz | Resumida sempre visível; modal com detalhe do nó | 4, 5 |
| **P4 — Inventário com abas** | Operador (seleção) | Abertura + troca de aba | Ativos e inativos por Cartão/Conta/Consórcio/Investimentos | Nenhum | Aba Todos vs. por família; item ativo vs. encerrado/bloqueado | Grade filtrada com selos funcionais; vazio sem erro | 6, 7 |
| **P5 — Detalhe volátil do ativo** | Operador (leitura) | Seleção de um ativo (com sub-abas paralelas) | Limites/fatura, saldo/PIX, assembleia, rentabilidade — sob demanda | Nenhum (nunca persiste) | Cache válido (≤180s) vs. reconsulta; sucesso vs. falha com retry | Painel por tipo renderizado ou banner de retry + leitura reduzida | 8, 9, 16 |
| **P6 — Painel NBO top 3** | Operador (decisão) | Retorno do motor + sync | Até 3 ofertas por prioridade (produto, condição, score, validade) | Recusa (1 clique + motivo) / aceite (marca negociação) | Recusar vs. contratar vs. ignorar; motor fora (só banner) | Ofertas sem duplicar safra; expiradas encerradas; válidas ausentes mantidas | 10, 11, 12, 13 |
| **P7 — Histórico de atendimentos** | Operador (leitura) | Abertura da página | Casos recentes da conta | Nenhum | — | Lista simples, sem abrir protocolo | 14 |
| **P9 — Estados transversais** | Operador | Qualquer retorno | Flags por área (loading/empty/error/retry) | Nenhum | Sucesso vs. parcial vs. total | Skeletons por área; falha nunca bloqueia a tela | 9, 15 + EL-03 |
| **PT — Extensibilidade** | Negócio/Admin | Nova família/item configurado | Catálogo de tipos | Nenhum em runtime | — | Novo item surge sem refatorar demais áreas | RN-03 |

**Saída formal (para futuras vendas/transações):** `Contexto 360 = { conta raiz + ativo em foco (quando houver) + oferta em negociação (quando houver) }`. Ver RN-05/RN-14.

---

## 2. Vereditos padrão vs. customizado — gate padrão/declarativo primeiro (Princípio IV)

> **Gate Q1:** OmniStudio/FSC provisionados? Não confirmado (`constitution.md` + fundação pendente). Por regra, assume-se o padrão disponível e registra-se a dependência; onde o padrão cobre, a decisão se mantém mesmo sem a confirmação — só a entrega espera a fundação.

### P0 — Entrada pela busca
- **Veredito:** **padrão** (navegação)
- **Por quê:** link/ação de navegação para a página da conta; o clique no nome (ajuste pequeno no cartão da busca) publica o documento. Sem componente novo nesta capacidade.
- **Artefato:** navegação padrão + ajuste `busca-cliente/001` P3 (dependência reversa registrada).

### P1 — Faixa de destaques
- **Veredito:** **padrão**
- **Por que customizado não precisa:** Highlights Panel + Compact Layout da Account cobrem nome/documento/segmento/score; alertas via fórmula/campo + destaque nativo.
- **Artefato:** Highlights Panel (Compact Layout `Account_360_Header`).

### P2 — Resumo cadastral
- **Veredito:** **padrão**
- **Por que customizado não precisa:** Record Detail / Dynamic Forms da Account exibe contatos, telefones, e-mail e situação sem código.
- **Artefato:** Record Detail na coluna esquerda.

### P3 — Árvore de relacionamentos
- **Veredito:** **padrão**
- **Por que customizado não precisa:** ARC Relationship Graph (resumido, 1º nível) + ARC Details Panel + modal padrão com grafo expandido cobrem os dois modos; troca de raiz é navegação para outra Account.
- **Artefato:** ARC Graph + ARC Details Panel (config declarativa, limite 5/20 + paginação).

### P4 — Inventário com abas
- **Veredito:** **customizado**
- **Por que padrão não cobre (1 linha):** Related List é tabela única sem abas por família, sem cards com selo funcional por situação e sem publicação de seleção para o detalhe — e precisa ler `Asset` + NBO + casos agregados por cliente.
- **Tecnologia (árvore):** Q1 FSC/OmniStudio assumido disponível (dependência da fundação); Q3 não (grade interativa com estado); Q4 lógica de seleção + performance → **FlexCard** (`portoAssetInventory`, Tabs nativas, Conditional Styles, PubSub nativo)
- **Artefato:** FlexCard `portoAssetInventory` (Data Source Apex Remote).

### P5 — Detalhe volátil do ativo
- **Veredito:** **customizado**
- **Por que padrão não cobre (1 linha):** Nenhum componente padrão busca REST sob demanda por tipo de ativo com cache TTL, retry e templates distintos por família (limites/fatura, saldo/PIX, assembleia, rentabilidade).
- **Tecnologia:** Q4/Q5 orquestração + performance → **FlexCard** (`portoAssetRealtimeDetail`, escuta PubSub) + **Apex** (Remote Action síncrona + cache)
- **Artefato:** FlexCard `portoAssetRealtimeDetail` + `AssetOperationsService`.

### P6 — Painel NBO top 3
- **Veredito:** **customizado**
- **Por que padrão não cobre (1 linha):** Related List de Opportunity não ordena por score externo top 3, não faz recusa 1-clique com motivo em background nem direciona aceite à jornada de venda com contexto.
- **Tecnologia:** Q4 interação stateful + Q5 orquestração → **FlexCard** (`portoNBOPanel`) + **Apex** (`NBOService` sync + Queueable upsert)
- **Artefato:** FlexCard `portoNBOPanel` (Top 3, Recusar→Apex, Contratar→OmniScript futuro).

### P7 — Histórico de atendimentos
- **Veredito:** **padrão**
- **Por que customizado não precisa:** Related List – Single de Case na Account, ordenada por CreatedDate DESC, cobre a lista somente leitura.
- **Artefato:** Related List `Case` (Single).

### Multitarefa (Cenário 16)
- **Veredito:** **padrão**
- **Por que customizado não precisa:** Sub-abas do Console (Workspace API / navegação padrão) cobrem detalhes paralelos sem código custom.
- **Artefato:** Subtabs do Console.

### P9 — Estados transversais
- **Veredito:** **padrão nos padrões, customizado nos FlexCards**
- **Padrão não cobre nos FlexCards:** skeleton por área e Empty/Error State com retry declarativo existem como blocos nativos do FlexCard — usar os nativos, sem pattern custom.
- **Artefato:** blocos nativos (Spinner, Empty State, Error State + refresh Action).

### PT — Extensibilidade
- **Veredito:** **customizado (propriedade)**
- **Por que padrão não cobre:** Novo tipo sem rearranjo manual exige catálogo dirigido por metadado consumido pelo FlexCard.
- **Artefato:** `ProductCatalog__mdt` (o mesmo da busca) consumido pelos FlexCards.

---

## 3. Árvore de decisão Princípio V — síntese

| Passo | Q1 Lic.? | Q2 It. negócio? | Q3 Display leve? | Q4 Lógica/perf? | Q5 Orquestra? | Q6 Exp.Cloud? | Resultado |
|---|---|---|---|---|---|---|---|
| P0 | — | — | — | — | — | Não | **padrão** (navegação) |
| P1 | Assumido | Não | Sim | Não | Não | Não | **padrão** Highlights Panel |
| P2 | Assumido | Não | Sim | Não | Não | Não | **padrão** Record Detail |
| P3 | Assumido | Não | Sim (ARC) | Não | Não | Não | **padrão** ARC + Details |
| P4 | Assumido | Não | Não (grade+estado) | Sim | — | Não | **FlexCard** inventory |
| P5 | Assumido | Não | Não | Sim | Sim | Não | **FlexCard** + Apex |
| P6 | Assumido | Não | Não | Sim | Sim | Não | **FlexCard** + Apex |
| P7 | Assumido | Não | Sim | Não | Não | Não | **padrão** Related List |
| Multi | — | — | — | — | — | Não | **padrão** Subtabs |
| P9 | — | — | Parcial | Sim (FlexCards) | — | Não | **nativo FlexCard** |

---

## 4. Classificação final da capacidade

**Misto** — padrão onde cobre (P0/P1/P2/P3/P7/multitarefa/P9-nativo), customizado onde não (P4/P5/P6 FlexCards + Apex + PT metadado).

- **Alternativa 100% customizada rejeitada:** LWCs próprios para destaques, árvore, inventário e NBO — rejeitada porque duplica o que Highlights/ARC/FlexCard/Related List já entregam, violando Princípios IV/VI e criando dívida de sustentação (foi exatamente o erro do legado monolítico).
- **Gate do orchestrator:** por ser `misto`, exige justificativa por passo customizado (acima) + confirmação explícita do usuário antes de `prototype/` e `tasks.md`. **Não é falha** — é o desenho de menor custo sustentável.

---

## 5. Premissas abertas — 1× [NEEDS CLARIFICATION]

| # | Premissa aberta | Impacto no desenho atual | Placeholder no protótipo |
|---|---|---|---|
| 05 | [NEEDS CLARIFICATION: fontes de KYC/score/alerta de fraude — quais campos e critérios disparam cada alerta do topo?] | Faixa com alerta genérico ilustrativo | Banner "Alerta: perfil em revisão" fictício + score fictício |

Resolvidas em 2026-09-06 (RN-10–RN-15): motor fora (só banner), 5/20 nós, troca de raiz pela árvore, aceite com aviso, PIX mascaradas, sub-abas paralelas.

## 6. Reuso e acoplamento

- **Reuso dentro de `household-360`:** primeira capacidade — sem componente pré-existente. Os FlexCards (`portoAssetInventory`, `portoAssetRealtimeDetail`, `portoNBOPanel`) tornam-se o inventário do domínio.
- **Reuso a partir de `busca-cliente/001`:** somente **dado** (documento + contexto fixado). Dependência reversa registrada: o cartão da busca precisa tornar o nome clicável (ajuste P3 da busca, fora desta capacidade).
- **Acoplamento:** nenhum componente importado de outro domínio. LMS `PortoBank360Channel__c` é **interno** a `household-360/001` (seleção de ativo → detalhe). `CustomerInteractionChannel__c` (busca) não é assinado aqui.
- **Microfrontends desacoplados:** cada FlexCard/LWC tem Data Source/contrato próprio; nova família = entrada em `ProductCatalog__mdt` + ramo no FlexCard, sem tocar nos demais.

## 7. Gaps para `fsc-design-system-architect` (System Design não iniciado)

| Gap | Por que precisa de System Design | Default usado no protótipo |
|---|---|---|
| Tokens de selo por situação | Verde/âmbar/cinza funcionais nos cards de ativo | `slds-theme_success/warning/shade` + `lightning-badge` |
| Densidade 3 colunas bancária | 28/48/24 sem scroll excessivo | `slds-grid` + compact text |
| Skeleton por área em FlexCard | Cada painel carrega independente | Blocos nativos + skeletons no protótipo LWC |
| Modal de árvore completa | ARC expandido em tela cheia com Details Panel | `lightning/modal` no protótipo |
| Acessibilidade baseline | WCAG AA, teclado, leitor de tela em grade/modal | `aria-live`, foco gerenciado — validar quando ratificar |

## 8. Rastreabilidade — cenários → passos → artefatos

| Cenário(s) | Passo | Artefato build → componente do protótipo | Verificação no protótipo |
|---|---|---|---|
| 1 | P0 | Navegação padrão → link no header do protótipo da busca (dependência reversa) | Abrir `/visao-360` direto com `?doc=12345678900` |
| 2, 3 | P1, P2 | Highlights Panel + Record Detail → `ui/visaoHeader` | Topo + perfil com fixtures do João |
| 4, 5 | P3 | ARC Graph + Details → `ui/visaoArc` (resumida + modal, fixture) | 5 nós; modal com árvore + detalhe do nó |
| 6, 7 | P4 | FlexCard inventory → `ui/visaoAtivos` (abas + grade) | Abas Todos/Cartões/Conta/Consórcio/Invest; selos |
| 8, 9, 16 | P5 | FlexCard realtime + Apex → `ui/visaoAtivoDetalhe` (fixture + retry mock) | Selecionar ativo → detalhe; simular falha → retry; 2 ativos em sub-abas |
| 10–13 | P6 | FlexCard NBO + Apex → `ui/visaoNbo` (top 3, recusar/contratar mock) | 3 ofertas por score; recusar com motivo some; contratar marca negociação |
| 14 | P7 | Related List Case → `ui/visaoHistorico` (lista mock) | Casos recentes, sem criar protocolo |
| 15 + EL-03 | P9 | Blocos nativos → skeletons por área no shell | Áreas independentes |

Princípio IX: cada cenário tem caminho navegável no `prototype/` (roteiro em `prototype/README.md`) e linha em `architecture.md`.

## 9. Anti-patterns checados

- [x] Padrão checado antes de customizar — cada passo customizado tem o porquê de insuficiência do padrão.
- [x] FlexCard escolhido por Q3/Q4 (display interativo + lógica), não "porque é padrão FSC".
- [x] Sem LWC onde FlexCard/standard cobre — LWC só no protótipo como mock fiel dos FlexCards/ARC.
- [x] Estado via contratos internos ao domínio (PubSub/LMS no build; props/eventos no protótipo), sem vazar entre domínios.
- [x] Nenhum objeto/campo decidido aqui como final — mapeamento é premissa sujeita à fundação (ver §§11–17 como insumo exploratório).

## 10. Próximos gates

1. **Este `plan.md`** → revisão do orchestrator + confirmação do usuário (gate rígido, `misto`) — pendente.
2. **`prototype/`** → construído (shell + 8 componentes + fixtures, 26 arquivos) e validado tecnicamente em 2026-09-06: restore com coexistência de overlay, `npm run build` exit 0, linter 0 erros (só warnings estruturais sem hook), scorecard A (97/100/100/97), preview `200` em `/visao-360` e `/busca-cliente`, clean com kit limpo — **aguardando confirmação do negócio (gate rígido VIII).**
3. **`fsc-journey-tech-planner`** → §§11–17 + `tasks.md` (18) + `architecture.md` (17+3) já elaborados exploratoriamente.

---

*Fim de `plan.md` (UX) — `household-360/001`. Classificação: **misto**.*

---

# Parte Técnica — complemento `fsc-journey-tech-planner`

> **Status:** elaborado exploratoriamente (fundação pendente) sobre as decisões de negócio da spec. Protótipo valida UX; este complemento realiza tecnicamente.
> **Decisões herdadas de `visao360.md`:** página na Account raiz com sub-abas, 3 colunas, padrão FSC máximo, Apex só em orquestração/integração sem IPs, NBO com motor externo + idempotência `{doc}_{cod}_{periodo}`, voláteis sob demanda sem persistir, cache client-side curto, Named Credentials + gateway, top 3 NBO, recusa 1-clique com motivo, aceite → OmniScript futuro por produto.

---

## 11. Modelo de dados — origem → destino + Princípio VI

### 11.1 Princípio VI aplicado

| Objeto padrão checado | Cobriria? | Por que não adotado (ainda) nesta capacidade |
|---|---|---|
| `FinServ__FinancialAccount__c` / `FinServ__Card__c` / `FinServ__FinancialAccountRole__c` / Household FSC | Sim, semanticamente | Exigem pacote FSC + Person Account + Household — `constitution.md` em aberto, `_fundacao/001` não iniciado. Travaria esta capacidade. |
| Standard Data Model FSC nativo (`FinancialAccount`, `IssuedCard`, `Party*` — sem namespace) | Sim, se a org já estiver nele | A confirmar na fundação qual geração do modelo a org destino usa. |
| **Conclusão** | — | **Mesmo padrão da busca (RN-16):** `Account+Contact` + `Asset` + `Opportunity` + `Case` (leitura), sem objeto customizado de domínio. Reavaliação documentada quando a fundação ratificar. |

### 11.2 Tabela dado → campo

| # | Dado de negócio | Destino Salesforce | Tipo | Notas |
|---|---|---|---|---|
| D01 | Cliente raiz (documento do contexto) | `Account.Document__c` (External ID, o mesmo da busca) | Reuso | Sem duplicar cadastro; raiz de todas as leituras |
| D02 | Perfil/contato/score/KYC | `Account` + `Contact` espelho + `CustomerSegment__c` | Reuso | Alerta de fraude/score: campos a confirmar (premissa 05) |
| D03 | Ativos por família | `Asset` com `ProductType__c` + RecordTypes `CreditCard`/`DigitalAccount`/`Consortium`/`Investment` (premissa adotada) + `ExternalContractId__c`, `CardBrand__c`/`Last4__c`, `ConsorcioGrupo__c`/`ConsorcioCota__c`, `ValorContrato__c`, `ViaStatus__c` | Reuso + customs da busca | Hierarquia `ParentId` para vias/cotas filhas |
| D04 | Detalhe volátil | **Não persiste** — DTO em memória (`totalLimit`, `availableLimit`, `invoiceAmount`, `balance`, `pixKeys`, `debitBalance`, `nextMeetingDate`) | Transitório | Cache client-side 180s; retry com backoff |
| D05 | Ofertas NBO | `Opportunity`: `External_Offer_Id__c` (`{doc}_{cod}_{periodo}`, External ID), `Propensity_Score__c`, `OmniScript_Key__c`, `ExpirationDate__c`, Stage `Identified` → `Negotiation/Review` (aceite) / `Closed Lost` + `Loss_Reason__c` (recusa/expirada) | Reuso + customs | Upsert idempotente por safra; sem `NBO__c` customizado |
| D06 | Histórico | `Case` (leitura: data, motivo, situação) | Reuso | Sem criação de protocolo nesta capacidade |
| D07 | Relacionamentos | `AccountContactRelation` (papéis) + grupo/household (a ratificar na fundação) | Padrão | ARC lê o mesmo modelo |

### 11.3 Idempotência e ciclo de vida (RN-06)
- Upsert por `External_Offer_Id__c`; resposta sem oferta válida vencida → `Closed Lost` + motivo expiração; ausente-mas-válida → mantida; recusa → `Closed Lost` + motivo em Queueable (UI otimista remove na hora).

---

## 12. Automação — Apex só onde padrão não alcança

### 12.1 Vereditos
| Necessidade | Declarativo cobre? | Decisão |
|---|---|---|
| Highlights/Record Detail/ARC/Related List/Subtabs | Sim | Padrão, sem task de código |
| Tabs/filtro/badges do inventário | Parcial (layout sim, dados não) | FlexCard + Apex Remote |
| Detalhe volátil sob demanda + cache + retry | Não | FlexCard + Apex |
| NBO sync + top 3 + recusa/aceite | Não | FlexCard + Apex |
| Persistência NBO/auditoria | Não (assíncrona) | Queueable |

### 12.2 Arquitetura Apex
```
FlexCards (portoAssetInventory / portoAssetRealtimeDetail / portoNBOPanel)
  │  Apex Remote Action (sem IP)
  ├─► AssetOperationsController
  │     ├─► AssetInventoryService.getCustomerAssets(accountId)   // SOQL Asset + CMDT catálogo
  │     └─► AssetRealtimeService.fetchRealtime(contractNumber, family) // callout core + ApiFault
  ├─► NBOController
  │     ├─► NBOService.fetchEligibleOffers(accountId)           // callout motor → top 3
  │     ├─► NBOSyncQueueable(accountId, offers)                 // upsert Opportunity idempotente
  │     └─► NBORejectQueueable(offerExternalId, reason)         // Closed Lost + feedback motor
  └─► HttpCalloutService (Named Credentials, timeout por fonte)
```
- LMS `PortoBank360Channel__c` interno ao domínio (seleção de ativo → detalhe); nunca cross-domain.
- OmniScripts de venda (`osSale*`) são capacidades futuras — aqui só o direcionamento com `OpportunityId`+`AccountId`+`omniScriptKey`.

### 12.3 DTOs
- `AssetSummaryDTO { assetId, contractNumber, productFamily, label, maskedId, status }`
- `AssetRealtimeDTO { totalLimit, availableLimit, invoiceAmount, dueDate, balance, pixKeys, debitBalance, nextMeetingDate }`
- `NBOOfferDTO { offerId, productCode, productName, category, priority, propensityScore, headline, omniScriptKey, expirationDate }`
- Reuso: `ApiFaultDTO`, `ProductCatalog__mdt`, `InteractionContextDTO` (leitura do contexto da busca).

---

## 13. Segurança — Princípio VII

| Objeto | OWD proposto | Justificativa |
|---|---|---|
| `Account`/`Contact` | `Private` / `ControlledByParent` | Mesmo baseline da busca (re-derivado, não copiado) |
| `Asset` | `Private` | Vínculo financeiro sensível, inclui inativos |
| `Opportunity` (NBO) | `Private` | Propensão comercial sensível |
| `Case` | `Private` (leitura nesta capacidade) | Histórico visível, sem criação aqui |
| `ProductCatalog__mdt` | `Public Read Only` | Catálogo não sensível |

- `PS_Visao360_Operador`: Read em Account/Contact/Asset/Opportunity/Case + Apex executáveis + FlexCards visíveis. Sem Profile clonado.
- Premissas abertas: base legal LGPD de exibição (herdada da busca), perfis com menos dados, mascaramento PIX (RN-15).

---

## 14. Integração

| # | Sistema | Operação | Tecnologia | Sync/Async | Timeout |
|---|---|---|---|---|---|
| I01 | Motor de propensão NBO | `GET /nbo/elegibilidade/{doc}` → top 3 + sync | `NBOService` → `NC_NboMotor` | Sync exibe + Queueable persiste | 3.0s |
| I02 | Core bancário volátil | `GET /ativos/{contrato}/realtime` por família | `AssetRealtimeService` → `NC_CoreBancario` | Sync sob demanda + cache 180s client | 3.0s |
| I03 | Cadastro/inventário/casos | SOQL local (`Account/Asset/Opportunity/Case`) | Services, sem callout | Sync | — |
| I04 | Feedback de recusa ao motor | `POST /nbo/feedback {offerId, reason}` | `NBORejectQueueable` | Async | — |

- Retry só com backoff no detalhe volátil (botão explícito); callouts sem retry automático; `ApiFaultDTO` → banner + leitura reduzida (RN-07).
- `NC_*` com External Credential (OAuth2/mTLS) via gateway corporativo — sem segredo no código.

## 15. Migração

Sem bulk nesta capacidade (`_fundacao/002`). Migração = upsert progressivo de NBO + leitura do consolidado; mapeamento `Asset` legado → modelo final fica na fundação.

## 16. Estratégia de teste

| Cenário(s) | Apex test | Validação funcional (protótipo) |
|---|---|---|
| 1, 2, 3 (entrada/topo/perfil) | `AssetInventoryServiceTest` (mock SOQL) | Abrir `/visao-360?doc=...` → topo + perfil |
| 4, 5 (árvore) | — (declarativo; validar config ARC em sandbox) | 5 nós; modal + detalhe do nó |
| 6, 7, 16 (abas/selos/multitarefa) | `AssetInventoryServiceTest` (filtros, inativos) | Trocar abas; 2 ativos em paralelo |
| 8, 9 (volátil + falha) | `AssetRealtimeServiceTest` (HttpCalloutMock ok/timeout; cache TTL) | Detalhe por tipo; simular falha → retry |
| 10–13 (NBO) | `NBOServiceTest` (top 3, dedup safra, expiradas), `NBORejectQueueableTest` | 3 por score; recusar some; contratar marca |
| 14 (histórico) | — (Related List padrão) | Lista sem criar protocolo |
| 15 (progressivo) | Controller allSettled | Skeletons por área |

Jest para os LWC do protótipo (mock de dados); FlexCards validados por checklist funcional em sandbox (não há Jest para FlexCard).

## 17. Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| R01 `_fundacao/001` indefinida (Person/Household/`FinServ__*`) | Alta | Alto — remodelagem | Modelo core reversível + External IDs; DTO estável |
| R02 Licenças FSC/OmniStudio não confirmadas | Média | Alto — FlexCard/ARC indisponíveis | Protótipo LWC aprova UX; entrega aguarda fundação |
| R03 Limites ARC (10 filhos/nó, 5 junctions) em household denso | Média | Médio | Filtros + paginação (RN-13); validar em piloto |
| R04 SLA core/motor desconhecido | Média | Alto (TMA) | Timeouts finos + cache + retry explícito; medir em piloto |
| R05 OmniScripts de venda inexistentes no aceite | Alta (já ocorre) | Baixo | RN-14 (aviso + mantém tela); jornadas futuras consomem o contexto |

---

*Fim de complemento técnico — `fsc-journey-tech-planner`. Próximos artefactos: `tasks.md` + `architecture.md`.*
