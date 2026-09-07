# Tasks — `household-360/001` — Visão 360° do cliente Porto Bank

> **Ordem de build real:** dados + segurança → integração/automação Apex → UI (padrão primeiro, FlexCards depois) → testes → cutover.
> **Validação UX:** `prototype/` (LWC real sobre SLDS2 real, mock fiel dos FlexCards/ARC) validado pelo negócio (gate VIII) — não re-litigar UX, apenas realizar tecnicamente. Ver `prototype/README.md`.
> **Premissas abertas:** 1× [NEEDS CLARIFICATION] (fontes KYC/fraude) + placeholders reversíveis — nenhuma regra inventada.
> **Princípios:** IV (padrão primeiro), VI (sem objeto customizado), VII (segurança re-derivada), IX (cada cenário tem task).

---

## Grupo A — Modelo de dados (reuso + customs onde padrão não tem)

- [ ] **T-A01 — Reusar campos da busca + RecordTypes Asset** — Confirmar `Account.Document__c`, `Asset.ExternalContractId__c`/`ProductType__c`/campos de via/cota/posição, `Opportunity.ExternalOfferId__c` (vindos de `busca-cliente/001`); criar RecordTypes `CreditCard`/`DigitalAccount`/`Consortium`/`Investment` em `Asset` — **Depende de:** `busca-cliente/001` A-foundation, `_fundacao/001` — **Cenários:** 6, 7 — **Aceite:** 4 RTs ativos; inventário filtra por RT sem SOQL dinâmica insegura.
- [ ] **T-A02 — Campos NBO em Opportunity** — `Propensity_Score__c` (Number), `OmniScript_Key__c` (Text 80), `ExpirationDate__c` (Date), `Loss_Reason__c` (Text 255) — **Depende de:** T-A01 — **Cenários:** 10–13 — **Aceite:** upsert por `External_Offer_Id__c` não duplica safra; expirada → `Closed Lost`.
- [ ] **T-A03 — ACR/papéis + grupo para ARC** — Confirmar `AccountContactRelation` com papéis (titular, cônjuge, sócio, procurador) e associação conta↔grupo/household conforme `_fundacao/001` — **Depende de:** `_fundacao/001` — **Cenários:** 4, 5 — **Aceite:** ARC lê 1º nível + modal multinível sem objeto customizado.

## Grupo B — Segurança (Princípio VII)

- [ ] **T-B01 — OWD + PS_Visao360_Operador** — `Account/Contact/Asset/Opportunity/Case=Private` (re-derivado, não copiado); `PS_Visao360_Operador` com Read + Apex executáveis + FlexCards visíveis; FLS mascara PIX e documento — **Depende de:** T-A01–T-A03 — **Cenários:** todos (acesso) — **Aceite:** sem PS falha `INSUFFICIENT_ACCESS`; PIX mascarada (RN-15).

## Grupo C — Integração e Automação Apex (sem IP)

- [ ] **T-C01 — Named Credentials** — `NC_NboMotor` (reuso busca) + `NC_CoreBancario` (`/ativos/{contrato}/realtime`, timeout 3.0s) via gateway, External Credential OAuth2/mTLS — **Depende de:** T-B01 — **Cenários:** I01, I02 — **Aceite:** sem hardcode; mock cobre ok/timeout/5xx.
- [ ] **T-C02 — HttpCalloutService (reuso + fault)** — Reusar padrão da busca (`call(nc,path,timeoutMs)` → `HttpResponse | ApiFaultDTO`) — **Depende de:** T-C01 — **Cenários:** 9, 15 — **Aceite:** timeout → `ApiFaultDTO`, sem exceção para a UI.
- [ ] **T-C03 — AssetOperationsService/Controller** — `getCustomerAssets(accountId)` (SOQL Asset + CMDT, ativos+inativos) + `fetchRealtimeData(contractNumber, family)` (callout core por tipo) — **Depende de:** T-C02, T-A01 — **Cenários:** 6, 7, 8, 16 — **Aceite:** 4 famílias; retry só via botão (sem loop automático).
- [ ] **T-C04 — NBOService/Controller + Queueables** — `getOffersAndSync` (callout motor → top 3 imediato + `NBOSyncQueueable` upsert idempotente), `rejectOffer` → `NBORejectQueueable` (Closed Lost + motivo + feedback motor) — **Depende de:** T-C02, T-A02 — **Cenários:** 10–13 — **Aceite:** mesma safra 2x não duplica; expirada fecha com motivo; ausente-válida mantida.
- [ ] **T-C05 — LMS PortoBank360Channel__c** — `messageChannel-meta.xml` (`assetId`, `contractNumber`, `productFamily`, `status`), interno ao domínio — **Depende de:** nada (puro) — **Cenários:** 8 — **Aceite:** seleção publica; detalhe assina; nada cross-domain.

## Grupo D — UI (padrão primeiro, FlexCard onde precisa)

- [ ] **T-D01 — Highlights + Record Detail (padrão)** — Compact Layout `Account_360_Header` + Record Detail na coluna esquerda — **Depende de:** T-A01 — **Cenários:** 2, 3 — **Aceite:** sem código; campos KYC/score como placeholder até premissa 05.
- [ ] **T-D02 — ARC Graph + Details (padrão, config)** — ARC compacto (1º nível, ≤5 nós) + modal expandido (≤20 + paginação) + Details Panel; troca de raiz = navegação — **Depende de:** T-A03 — **Cenários:** 4, 5 — **Aceite:** resumida sempre visível; modal com detalhe do nó.
- [ ] **T-D03 — FlexCard portoAssetInventory** — Abas Todos/Cartões/Conta/Consórcio/Invest, cards com selo funcional, publica seleção no canal — **Depende de:** T-C03, T-C05 — **Cenários:** 6, 7 — **Aceite:** ativos+inativos; vazio sem erro.
- [ ] **T-D04 — FlexCard portoAssetRealtimeDetail** — Escuta o canal; templates por família; cache 180s; retry explícito; nunca persiste volátil — **Depende de:** T-C03, T-C05 — **Cenários:** 8, 9, 16 — **Aceite:** detalhe por tipo; falha → banner + leitura reduzida.
- [ ] **T-D05 — FlexCard portoNBOPanel** — Top 3 por score; Recusar (motivo rápido, otimista) / Contratar (direciona OmniScript futuro com contexto) — **Depende de:** T-C04, T-C05 — **Cenários:** 10–13 — **Aceite:** recusa some na hora; aceite marca negociação (RN-14).
- [ ] **T-D06 — Related List Case + Subtabs (padrão)** — `Case` Single por CreatedDate DESC; subtabs do Console para multitarefa — **Depende de:** nada (padrão) — **Cenários:** 14, 16 — **Aceite:** lista sem criar protocolo; 2 ativos em paralelo.
- [ ] **T-D07 — App Builder da página (montagem)** — Account record page 28/48/24 com os componentes acima; sem wrapper custom — **Depende de:** T-D01–T-D06 — **Cenários:** 15 — **Aceite:** áreas independentes com estados nativos.

## Grupo E — Migração

- [ ] **T-E01 — Sem bulk; upsert NBO progressivo** — Só `NBOSyncQueueable` idempotente; mapeamento legado → fundação (`_fundacao/002`) — **Depende de:** T-C04 — **Cenários:** 11 — **Aceite:** re-sync da safra não duplica.

## Grupo F — Testes (Princípio IX)

- [ ] **T-F01 — Apex tests (75%+)** — `AssetOperationsServiceTest` (filtros, inativos, retry), `NBOServiceTest` (top 3, dedup, expiradas, ausente-válida), `NBORejectQueueableTest`, `NBOSyncQueueableTest`, `HttpCalloutMock` ok/timeout/5xx — **Depende de:** T-C01–T-C05 — **Cenários:** 6–13 — **Aceite:** `RunLocalTests` ≥75% por classe.
- [ ] **T-F02 — Jest protótipo + checklist FlexCard/ARC** — Jest nos LWC do `prototype/`; checklist funcional em sandbox para FlexCards (abas, badges, retry, recusa/aceite) e ARC (5/20 nós, modal, troca de raiz) — **Depende de:** T-D01–T-D07 — **Cenários:** todos — **Aceite:** unit verde + checklist assinado.
- [ ] **T-F03 — Validação funcional 16 cenários** — Roteiro `prototype/README.md` via restore+preview (Cen 1–16 + ELs) — **Depende de:** T-D07 — **Cenários:** 1–16 + ELs — **Aceite:** cada cenário navegável; `evidence.md` opcional.

## Grupo G — Cutover

- [ ] **T-G01 — package.xml isolado + smoke + rollback** — Manifest (fields, CMDT, 3 FlexCards, LMS, Apex, PS; sem outro domínio) + dry-run + piloto (skeletons→detalhe→NBO→retry) + rollback (desativar PS) — **Depende de:** T-F03 — **Cenários:** — **Aceite:** deploy limpo; piloto completa sem travar em falha parcial.

---

**Total tasks:** 18 (A:3 + B:1 + C:5 + D:7 + E:1 + F:3 + G:1).
**Cobertura:** 16 cenários + 7 ELs + 1 premissa aberta como placeholder.
