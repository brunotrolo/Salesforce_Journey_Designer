# Architecture — `household-360/001` — Visão 360° do cliente Porto Bank

> **Mapa de artefactos e conexões** (Princípio IX). Protótipo validado (gate VIII) — ver `prototype/README.md`.

## 1. Artefactos e conexões

| # | Artefato | Tipo | Depende de | Chama / é chamado por | Lê | Escreve | Consumido por |
|---|---|---|---|---|---|---|---|
| A01 | `Account` + `Contact` + `Document__c` (reuso busca) | Standard | `busca-cliente/001` | Lido por A04, A06, A09 | `Account` | — | P0–P3 (raiz) |
| A02 | `Asset` + RTs + customs (reuso + `Consorcio*/Invest*`) | Standard+ | A01, T-A01 | Lido por A04; escrito por sync | `Asset` | `Asset` (sync) | P4 (inventário) |
| A03 | `Opportunity` + `External_Offer_Id__c`, `Propensity_Score__c`, `OmniScript_Key__c`, `ExpirationDate__c`, `Loss_Reason__c` | Standard+ | A01 | Escrito por A08; lido por A09 | `Opportunity` | `Opportunity` | P6 (NBO) |
| A04 | `AssetOperationsService` + Controller (`getCustomerAssets`, `fetchRealtimeData`) | Apex | A02, A10 | Chamado por FlexCards realtime/inventory | `Asset`, core via A10 | — (volátil não persiste) | P4, P5 |
| A05 | `ProductCatalog__mdt` (reuso busca) | CMDT | — | Lido por A04 | CMDT | — | PT |
| A06 | `NBOService` + Controller (`getOffersAndSync`, `rejectOffer`) | Apex | A03, A10 | Chamado pelo FlexCard NBO | motor via A10; `Opportunity` | `Opportunity` (via A07/A08) | P6 |
| A07 | `NBOSyncQueueable` (upsert idempotente por safra) | Apex | A03 | Chamado por A06 | ofertas | `Opportunity` | P6 (RN-06) |
| A08 | `NBORejectQueueable` (Closed Lost + motivo + feedback) | Apex | A03 | Chamado por A06 | oferta | `Opportunity` | P6 (Cen 12) |
| A09 | `Case` (Related List, leitura) | Standard | A01 | Lido pela página | `Case` | — | P7 |
| A10 | `HttpCalloutService` + `NC_NboMotor` + `NC_CoreBancario` | Apex/NC | `PS` | Chamado por A04, A06 | externos | `ApiFaultDTO` | P5, P6, P9 |
| A11 | `PortoBank360Channel__c` (`assetId`, `contractNumber`, `productFamily`, `status`) | LMS | — | Publicado pelo inventory; assinado pelo realtime | — | — | P5, P8 (interno ao domínio) |
| A12 | Highlights Panel + Record Detail + Related List + Subtabs (padrão) | Declarativo | A01 | — | `Account/Contact/Case` | — | P0–P3, P7, multi |
| A13 | ARC Graph + Details Panel (config) | Declarativo/FSC | A01 | — | relacionamentos | — | P3 |
| A14 | FlexCards `portoAssetInventory` + `portoAssetRealtimeDetail` + `portoNBOPanel` | FlexCard | A04, A06, A11 | Chamam A04/A06; publicam/assinam A11 | DTOs | — | P4, P5, P6 |
| A15 | `PS_Visao360_Operador` + OWD Private re-derivado | PS | A01–A03 | Permite A04, A06, A10, A14 | — | — | Todas |
| A16 | Testes (Apex 75%+ + Jest protótipo + checklist FlexCard/ARC) | Test | A04–A15 | Cobrem A04, A06–A08, A14 | — | — | §16 |
| A17 | `manifest/package-household-360-001.xml` (isolado) | Manifest | A01–A16 | `sf deploy` | — | — | G01 |

## 2. Contratos cross-domain (só dado/evento)

| Consumidor/produtor | Lê/expõe | Como |
|---|---|---|
| `busca-cliente/001` → esta | documento + contexto fixado | Navegação com parâmetro (dependência reversa: nome clicável) |
| Futuras vendas por produto | oferta em negociação + `OpportunityId`/`AccountId`/`omniScriptKey` | Direcionamento (fora desta capacidade) |
| `household-360/*` futuras | `Account/Asset/Opportunity` consolidados | SOQL/API, nunca componente |

## 3. Constraints de ordem de build

1. **A01 → A02/A03 → A10 → A04/A06 → A11 → A14 → A16 → A17**; fundação (`_fundacao/001`) antes de A01 finalizar; PS (A15) antes de testes com `runAs`.
2. **Volátil nunca vira campo persistido** — `AssetRealtimeDTO` não mapeia para `Asset.*`; violar isso quebra RN-04.
3. **Recusa é otimista + assíncrona** — UI remove na hora; Apex confirma depois (RN-05).
4. **`PortoBank360Channel__c` ≠ `CustomerInteractionChannel__c`** — canais distintos por domínio, sem subscribe cruzado.

## 4. Mapeamento build ↔ protótipo

| Build | Protótipo (`prototype/`) |
|---|---|
| Highlights + Record Detail + Related List + Subtabs | `ui/visaoHeader` (mock fiel em LWC) |
| ARC Graph + Details | `ui/visaoArc` (árvore fixture + modal) |
| `portoAssetInventory` | `ui/visaoAtivos` (abas + grade mock) |
| `portoAssetRealtimeDetail` + Apex | `ui/visaoAtivoDetalhe` (fixture + retry mock + cache) |
| `portoNBOPanel` + Apex | `ui/visaoNbo` (top 3, recusar/contratar mock) |
| Shell/orquestração | `page/visaoCliente` |

**Total:** 17 artefactos + 3 contratos = **20 linhas**; 100% das 18 tasks cobertas.
**Rastreabilidade Princípio IX:** 16 cenários com linha `Consumido por` + task + caminho no protótipo.
