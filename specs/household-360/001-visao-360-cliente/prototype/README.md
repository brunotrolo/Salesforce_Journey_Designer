# Protótipo — `household-360/001` (fonte única da jornada)

Esta pasta é a **fonte única** de todos os arquivos da jornada. Nada da jornada
vive no kit vendorizado (`.claude/skills/salesforce-ux/design-system-2-starter-kit/`)
fora de um overlay temporário de validação — ver `scripts/restore-prototype.mjs`.

## Estrutura (espelha `src/modules/` do kit)

| Esta pasta | Destino temporário no kit (só p/ validar) |
|---|---|
| `page/visaoCliente/` (shell: estado, `?doc=`, sub-abas paralelas) | `src/modules/page/visaoCliente/` |
| `data/visao360/` (fixtures João + simulação core/NBO + cache 180s) | `src/modules/data/visao360/` |
| `ui/visaoHeader/` (P1/P2 — destaques + perfil) | `src/modules/ui/visaoHeader/` |
| `ui/visaoArc/` (P3 — resumida 5 nós + abre modal) | `src/modules/ui/visaoArc/` |
| `ui/visaoArcModal/` (P3 — árvore completa tela-cheia + detalhe do nó) | `src/modules/ui/visaoArcModal/` |
| `ui/visaoAtivos/` (P4 — abas + grade com selos) | `src/modules/ui/visaoAtivos/` |
| `ui/visaoAtivoDetalhe/` (P5 — detalhe por tipo + skeleton + retry) | `src/modules/ui/visaoAtivoDetalhe/` |
| `ui/visaoNbo/` (P6 — top 3, recusar/contratar) | `src/modules/ui/visaoNbo/` |
| `ui/visaoHistorico/` (P7 — casos, somente leitura) | `src/modules/ui/visaoHistorico/` |

## Fiação temporária (aplicada pelo restore, revertida pelo clean)

Blocos legíveis por `scripts/restore-prototype.mjs` — não mude o formato
`// SECTION:` sem atualizar o script.

`src/routes.config.js` — acrescentar ao array `routes`:
```js
// SECTION: routes
  {
    path: '/',
    component: 'page-visao-cliente',
    title: 'Visão 360° do Cliente',
    navPage: 'visao-cliente',
    navLabel: 'Visão 360°',
    app: 'visao-cliente',
  },
```

`src/apps.config.js` — acrescentar ao array `apps`:
```js
// SECTION: apps
  {
    id: 'visao-cliente',
    label: 'Visão 360°',
    variant: 'console',
    icon: 'standard:person_account',
    pathPrefix: '/visao-cliente',
    defaultPath: '/visao-cliente',
    pages: ['visao-cliente'],
  },
```

`src/modules/shell/app/app.js` — acrescentar após o import do NotFound:
```js
// SECTION: appjs-import
import VisaoCliente from 'page/visaoCliente';
```

E em `ROUTE_COMPONENTS`, após a linha do Builder:
```js
// SECTION: appjs-route
    'page-visao-cliente': VisaoCliente,
```

## Validar (overlay temporário, depois limpa)

```bash
cd .claude/skills/salesforce-ux/design-system-2-starter-kit
node scripts/restore-prototype.mjs household-360/001-visao-360-cliente
npm run build
npm run open -- /visao-cliente   # ou abrir-prototipos.bat na raiz
node scripts/restore-prototype.mjs --clean household-360/001-visao-360-cliente
```

Após o `--clean`, `git status` no kit deve voltar a ficar limpo de arquivos
da jornada — a prova de que o kit ficou intocado.

## Roteiro de navegação → cenários do spec

Documentos de teste (`?doc=`; default João): `12345678900` (João, PF completo +
NBO top 3), `12ABC345000190` (Indústria Exemplo, PJ sem ofertas, abas vazias),
`11111111111` (Maria, só conta, sem ofertas), `99999999999` (Carlos, motor NBO
fora na 1ª carga → retry com sucesso).

| Ação no protótipo | Cenário(s) |
|---|---|
| Abrir `/visao-cliente` (default João) ou `/visao-cliente?doc=12345678900` — página abre com o cliente como raiz, sem redigitação | 1 |
| Topo: alerta "perfil em revisão", nome, CPF mascarado, segmento Exclusivo, saldo consolidado | 2 |
| Perfil: contato, endereço, renda/score, agência/conta | 3 |
| Esquerda: 5 nós (titular + cônjuge + 2 dependentes + empresa) sempre visíveis | 4 |
| "Ver árvore completa" → modal tela-cheia multinível + detalhe do nó; "Abrir Visão 360° deste vínculo" troca a raiz sem voltar à busca | 5, RN-11, EL-05 |
| Abas Todos/Cartões/Conta/Consórcio/Invest filtram a grade; seleção sobrevive à troca de aba | 6 |
| Grade com ativos e inativos: identificador mascarado + selo (verde ativo, cinza cancelado/encerrado, âmbar bloqueado) | 7 |
| Selecionar ativo → detalhe por tipo (limites/fatura, saldo/PIX mascaradas, saldo/assembleia, valor/rentabilidade) com horário da consulta; reselecionar mostra "(cache de 180s)"; Recarregar força nova consulta | 8, RN-15, EL-07 |
| Selecionar "Consórcio Imóvel" (1ª vez falha) → banner + "Tentar Novamente" + leitura reduzida, resto navegável; retry exibe o detalhe | 9 |
| Direita: 3 ofertas ordenadas por score (Black 92, Consórcio 81, CDB 74) com condição, validade e chave de safra `{doc}_{cod}_{periodo}` | 10, 11 |
| Recusar → motivo rápido (Sem Interesse/Achou Caro/Já Possui) → card some na hora | 12 |
| Contratar → marca negociação + "Oferta reservada, contratação em breve", sem sair da tela | 13, RN-14 |
| Histórico: 3 casos mock (data, motivo, situação), sem abrir protocolo | 14 |
| Recarregar a página: cada área mostra skeleton independente (header, árvore, ativos, NBO, histórico) | 15 |
| Selecionar 2º ativo sem fechar o 1º → 2 detalhes lado a lado em sub-abas; alternar foco; fechar por aba; 3º substitui o mais antigo | 16, RN-10 |
| PJ (`?doc=12ABC345000190`): abas Cartões/Consórcio vazias sem erro; NBO discreto sem ofertas; clicar no nó João troca a raiz de volta | EL-01, EL-02 |
| Carlos (`?doc=99999999999`): NBO só banner + retry, sem exibir ofertas antigas; retry carrega 2 ofertas | EL-03, RN-12 |
| Árvore completa indica "N de M vínculos" (limite 5/20 + paginação além disso) | EL-04, RN-13 |

Limitações conhecidas do mock (não são regra de negócio): upsert idempotente +
expiração de safra simulados em memória (sem Opportunity real); falha do core
só no consórcio do João na 1ª consulta (determinístico p/ demo); NBO fora do ar
só no Carlos na 1ª carga; árvore completa com 9/7 nós + contador de paginação
(sem dataset de 20+); troca de raiz limitada aos docs vinculados (João ↔
Indústria); fontes KYC/score/alerta seguem placeholder ([NEEDS CLARIFICATION]
nº 5 da spec).
