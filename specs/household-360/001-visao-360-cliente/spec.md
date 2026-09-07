# Spec — `household-360/001` — Visão 360° do cliente Porto Bank

| Campo | Valor |
|---|---|
| **Domínio** | `household-360` — Visão 360 do Household (ver `docs/sdd/DOMAINS.md`) |
| **Capacidade** | 001 — Painel consolidado de contas financeiras e holdings (visão 360° do cliente) |
| **Slug** | `001-visao-360-cliente` |
| **Status** | spec — especificada a partir de `visao360.md` (conversa de origem local, gitignored) |
| **BACKLOG** | Corresponde a `BACKLOG.md#household-360/001` ("Painel consolidado de contas financeiras e holdings do household") |
| **Conversa de origem** | `visao360.md` (raiz do projeto, local) — jornada desenhada com o negócio: layout 3 colunas, catálogo de 4 famílias, NBO com motor externo, ARC resumido + detalhe sob demanda, sem transacionais nesta entrega |

> **Caveats de fundação (gates):**
> - `_fundacao/001` (modelo de conta e segurança base) em **não iniciado** (gate rígido, Princípio I). A modelagem padrão FSC desta tela (conta individual vs. household/grupo, vínculos de titularidade e papéis) depende dela; `plan.md` técnico só fecha após a fundação. Prosseguimento exploratório somente com autorização.
> - `_fundacao/002` (migração de dados) é dependência declarada no BACKLOG para esta capacidade.
> - `docs/design-system/SYSTEM-DESIGN.md` em **não iniciado** (gate leve, Princípio II).
> - Diretriz inegociável desta jornada (pedido explícito do negócio): **nada 100% customizado** — usar o máximo de recursos padrão do FSC (Princípios IV e VI). Customização só onde o padrão comprovadamente não alcança, com justificativa em `plan.md`.

---

## 1. Contexto

Na jornada de `busca-cliente/001`, o operador identifica o cliente (CPF/CNPJ), vê ofertas e fixa o contexto de interação (cliente + produto + via/cota/posição). A etapa seguinte é o atendimento propriamente dito — e para atender bem, o operador precisa enxergar o cliente inteiro numa única tela: quem ele é, o que possui no banco, o que lhe foi ofertado e o histórico de contatos anteriores.

O sistema legado não oferece essa visão consolidada: cada produto vive numa tela própria, sem contexto compartilhado, e o operador alterna entre sistemas para montar mentalmente o quadro do cliente — custo direto em tempo médio de atendimento (TMA).

Esta capacidade cria a **tela de Visão 360° do cliente**: página nova e 100% independente, aberta pelo clique no nome do cliente no cartão de identificação da busca, montada sobre o modelo de dados padrão (conta do cliente como raiz) e, por diretriz do negócio, composta ao máximo com recursos padrão da plataforma — painéis de destaque, árvore de relacionamentos, listas de ativos com abas, painel de ofertas e lista de atendimentos.

## 2. Objetivo

Permitir que o operador, a partir do cliente já identificado, abra uma página independente com a visão consolidada do cliente Porto Bank — destaques e alertas no topo, perfil e relacionamentos à esquerda, inventário de ativos com detalhe sob demanda no centro, ofertas priorizadas e histórico à direita — carregando progressivamente sem travar a navegação, com dados voláteis (saldos, limites, faturas) consultados somente quando o ativo é selecionado e nunca gravados como se fossem cadastro.

**Sucesso =** operador entende quem é o cliente, o que ele tem, o que pode ofertar e o que já aconteceu — sem sair da tela, sem espera bloqueante e sem precisar decorar nada de outro sistema.

## 3. Escopo

### Dentro

- **Entrada:** clique no nome do cliente no cartão de identificação da busca abre a página 360° tendo como raiz a conta do cliente (o documento/contexto fixado na busca é a ponte entre as jornadas — via dado, nunca via componente compartilhado).
- **Topo (destaques):** alertas críticos (risco/fraude), nome, documento mascarado, segmento, saldo consolidado e protocolo/sessão quando houver.
- **Coluna esquerda — perfil e relacionamentos:** resumo cadastral (contatos, telefones, e-mail, situação cadastral, score), árvore de relacionamentos **sempre visível em formato resumido** (núcleo familiar/household, sócios e representantes de PJ com papéis) e ação para abrir a **árvore completa em modal** com painel de detalhes do nó selecionado.
- **Coluna central — inventário de ativos:** seletor por abas horizontais (Todos, Cartões, Conta, Consórcio, Investimentos); grade/lista com **ativos e inativos** de Cartão de Crédito, Conta Digital, Consórcio e Investimentos, cada item com identificador mascarado e selo de situação (verde ativo, cinza cancelado/encerrado, âmbar bloqueado/atraso); ao selecionar um ativo, painel de detalhe com os dados voláteis daquele tipo (cartão: limites, fatura, vencimento, dia de compra; conta: saldo, chaves PIX; consórcio: saldo devedor, próxima assembleia; investimentos: valor aplicado, rentabilidade).
- **Dados voláteis sob demanda com cache curto:** saldos, limites e faturas são consultados no core bancário somente quando o ativo é selecionado, com cache client-side curto (referência: 180 segundos) para não repetir chamadas pesadas no mesmo atendimento, botão de recarregar, e **nunca persistidos** como cadastro.
- **Fallback resiliente:** se a consulta ao core/m doubts motor falhar (timeout ou erro), a tela exibe banner amigável com botão "Tentar Novamente" e mantém os dados cadastrais básicos em modo de leitura reduzida — o operador nunca fica bloqueado em tela branca ou vazia.
- **Coluna direita — NBO:** lista de ofertas elegíveis **ordenada por prioridade/propensão, limitada às top 3**, cada card com produto, condição principal e score; **recusa em 1 clique** com motivo rápido (opções curtas, ex.: sem interesse / achou caro / já possui); **aceite direciona para a jornada de venda do produto** (fluxo guiado específico por produto — as jornadas de venda são capacidades futuras, aqui registra-se apenas o direcionamento com o contexto da oferta).
- **Sincronização NBO com o motor externo:** na abertura da tela o motor de propensão é consultado; as ofertas retornadas são exibidas de imediato e gravadas como oportunidades em segundo plano, sem duplicar a mesma safra comercial (chave de idempotência por documento + código da oferta + período, ex.: `{CPF}_{COD}_{ANO_MES}`); ofertas vencidas passam a encerradas com motivo de expiração; ofertas ausentes na resposta mas ainda válidas são mantidas.
- **Coluna direita — histórico:** lista simples dos atendimentos/casos recentes da conta, somente leitura.
- **Extensibilidade:** nova família de produto ou novo item aparecem no inventário sem refatorar as demais áreas.

### Fora

- **Jornadas transacionais guiadas** (contestação, bloqueio/desbloqueio, alteração de limite, 2ª via, lance de consórcio etc.) — ficam para capacidades futuras; nesta entrega só a visão 360° + aceitar/recusar NBO (o aceite aponta para a futura jornada de venda do produto).
- **Abertura automática de protocolo/caso** nesta tela — deferrado pelo negócio: por enquanto, apenas a lista de casos relacionados à conta, sem aprofundar gestão de protocolo aqui.
- Cadastro ou edição manual de dados cadastrais, limites ou contratos nesta tela.
- Regras do motor de propensão (como a elegibilidade/score é calculado) — esta capacidade apenas **consulta, ordena, exibe e sincroniza** o resultado.
- Autenticação adicional (2FA/token/biometria) — viaja junto com as futuras jornadas transacionais, não com esta tela.

---

## 4. Cenários de aceite (Given/When/Then)

### 4.1 Entrada e topo

**Cenário 1 — Abertura pelo nome do cliente**
- **Dado** um operador com o contexto de interação fixado na busca (cliente identificado)
- **Quando** clica no nome do cliente no cartão de identificação
- **Então** o sistema abre a página 360° tendo aquele cliente como raiz, sem exigir nova digitação e sem perder o contexto já fixado

**Cenário 2 — Faixa de destaques**
- **Dado** a página 360° aberta para um cliente
- **Quando** ela carrega
- **Então** o topo exibe alertas críticos quando houver (risco/fraude), nome, documento mascarado, segmento e saldo consolidado

### 4.2 Coluna esquerda — perfil e relacionamentos

**Cenário 3 — Resumo cadastral**
- **Dado** a página aberta
- **Quando** a coluna esquerda carrega
- **Então** exibe contatos, telefones, e-mail, situação cadastral e score/faixa do cliente

**Cenário 4 — Árvore resumida sempre visível**
- **Dado** a página aberta
- **Quando** a coluna esquerda carrega
- **Então** exibe os vínculos de 1º nível (núcleo familiar/household, sócios e representantes de PJ com papéis) sem ocupar a tela toda

**Cenário 5 — Árvore completa sob demanda**
- **Dado** a árvore resumida visível
- **Quando** o operador aciona "Ver árvore completa"
- **Então** o sistema abre um modal em tela cheia com a árvore multinível (empresas coligadas, sócios, cônjuge, dependentes) e painel lateral de detalhes do nó selecionado, sem sair do atendimento

### 4.3 Coluna central — inventário e detalhe

**Cenário 6 — Abas por família de produto**
- **Dado** a página aberta
- **Quando** o operador alterna entre Todos, Cartões, Conta, Consórcio e Investimentos
- **Então** a lista filtra pelos ativos daquela família, mantendo a seleção atual quando o item pertence ao filtro

**Cenário 7 — Ativos e inativos com selo funcional**
- **Dado** um cliente com vínculos ativos e encerrados
- **Quando** o inventário é exibido
- **Então** cada item mostra identificador mascarado (ex.: final do cartão, grupo/cota, agência/conta) e selo de situação com cor funcional (verde ativo, cinza cancelado/encerrado, âmbar bloqueado/atraso)

**Cenário 8 — Detalhe volátil sob demanda com cache curto**
- **Dado** o inventário carregado
- **Quando** o operador seleciona um ativo
- **Então** o painel de detalhe busca os dados voláteis daquele tipo (limites/fatura, saldo/PIX, saldo devedor/assembleia, valor/rentabilidade) e os exibe sem recarregar a página; ao reselecionar o mesmo ativo em curto intervalo, o retorno é imediato (cache), com botão de recarregar para forçar nova consulta

**Cenário 9 — Falha no core não bloqueia o operador**
- **Dado** o operador selecionando um ativo
- **Quando** a consulta ao core bancário falha (timeout ou erro)
- **Então** o painel exibe banner amigável com botão "Tentar Novamente" e mantém os dados cadastrais do ativo em leitura reduzida; o restante da tela continua navegável

### 4.4 Coluna direita — NBO e histórico

**Cenário 10 — Top 3 ofertas por prioridade**
- **Dado** um cliente com ofertas elegíveis retornadas pelo motor
- **Quando** o painel NBO carrega
- **Então** exibe até 3 ofertas ordenadas por prioridade/propensão, cada card com produto, condição principal e score; sem ofertas, informa discretamente sem erro

**Cenário 11 — Sincronização sem duplicar safra**
- **Dado** o motor retornando ofertas na abertura da tela
- **Quando** a sincronização em segundo plano executa
- **Então** cada oferta vira/atualiza uma única oportunidade pela chave de idempotência (documento + código + período); a mesma safra nunca duplica; ofertas vencidas passam a encerradas com motivo de expiração; ofertas ausentes na resposta mas ainda válidas são mantidas

**Cenário 12 — Recusa em 1 clique com motivo**
- **Dado** um card de oferta exibido
- **Quando** o operador recusa escolhendo um motivo rápido (ex.: sem interesse, achou caro, já possui)
- **Então** o card some imediatamente da tela e a recusa é registrada em segundo plano sem travar a navegação

**Cenário 13 — Aceite direciona à jornada de venda**
- **Dado** um card de oferta exibido
- **Quando** o operador aceita (Contratar)
- **Então** a oferta é marcada em negociação e o fluxo segue para a jornada de venda guiada específica daquele produto (capacidade futura), levando o contexto da oferta; esta tela não efetiva a contratação

**Cenário 14 — Histórico de atendimentos**
- **Dado** a página aberta
- **Quando** a coluna direita carrega
- **Então** lista os casos recentes da conta (data, motivo, situação), somente leitura, sem abrir protocolo novo

### 4.5 Performance e resiliência

**Cenário 15 — Carregamento progressivo por área**
- **Dado** a página sendo aberta
- **Quando** as fontes respondem em tempos distintos
- **Então** cada área (perfil, inventário, detalhe, NBO, histórico) carrega de forma independente com indicação sutil, sem travar as demais

---

## 5. Regras de negócio

| # | Regra | Descrição em linguagem de negócio |
|---|---|---|
| RN-01 | Padrão FSC primeiro, custom só com justificativa | Cada bloco da tela usa o recurso padrão que o cobre (painel de destaques, árvore de relacionamentos, listas, abas); código custom existe só onde o padrão comprovadamente não alcança. Vale para esta capacidade e para as futuras que nascerem dela. |
| RN-02 | Entrada pelo contexto da busca | A página abre a partir do cliente já identificado (documento + contexto fixado); nunca pede redigitação. A única ponte entre as jornadas é dado, nunca componente compartilhado. |
| RN-03 | Catálogo de 4 famílias, ativos e inativos | Cartão de Crédito, Conta Digital, Consórcio e Investimentos; itens ativos e encerrados/bloqueados aparecem listados, distinguíveis pelo selo. Nova família entra sem refatorar as demais. |
| RN-04 | Mestres persistem, voláteis não | Cadastro, inventário, casos e oportunidades persistem e sincronizam em segundo plano; saldos, limites, faturas e extratos vivem só em memória/caches curtos e nunca são gravados como cadastro. |
| RN-05 | NBO top 3 com recusa rápida e aceite guiado | Ofertas ordenadas por prioridade, no máximo 3 visíveis; recusa é 1 clique com motivo e some na hora; aceite marca negociação e direciona à jornada de venda do produto (futura). |
| RN-06 | Idempotência e ciclo de vida da safra | Mesma safra comercial nunca duplica oportunidade (chave documento + código + período); vencida vira encerrada com motivo de expiração; ausente na resposta mas válida é mantida. |
| RN-07 | Falha parcial nunca bloqueia | Qualquer fonte indisponível vira banner com retry + leitura reduzida; o resto da tela segue navegável. |
| RN-08 | Relacionamentos resumidos sempre, detalhe sob demanda | 1º nível visível na lateral; árvore completa só em modal com painel de detalhes do nó. |
| RN-09 | Protocolo/caso deferrado | Nesta entrega a tela só lista casos da conta; abertura e gestão de protocolo ficam para capacidade futura. |

---

## 6. Casos limite e edge cases

| # | Situação | Comportamento esperado |
|---|---|---|
| EL-01 | Cliente sem nenhum ativo em alguma família | Aba da família informa ausência sem erro; demais abas normais. |
| EL-02 | Cliente sem ofertas elegíveis | Painel NBO informa discretamente; restante da tela normal. |
| EL-03 | Motor NBO fora do ar na abertura | Banner com retry; oportunidades já gravadas anteriormente podem ser exibidas como último estado conhecido [NEEDS CLARIFICATION: exibir último estado ou só banner?]. |
| EL-04 | Household/grupo muito denso (dezenas de membros) | Árvore resumida mostra 1º nível com filtros; completa carrega sob demanda com paginação/limite [NEEDS CLARIFICATION: limite de nós por nível?]. |
| EL-05 | Múltiplas contas do mesmo titular (PF + PJ vinculadas) | A página abre no contexto do documento buscado; vínculos cruzados aparecem na árvore, sem misturar inventários [NEEDS CLARIFICATION: alternar raiz PF/PJ sem voltar à busca?]. |
| EL-06 | Oferta aceita mas jornada de venda do produto ainda não existe | Aceite marca negociação e informa que a contratação segue em jornada futura; sem erro nem beco sem saída [NEEDS CLARIFICATION: texto exato e destino temporário?]. |
| EL-07 | Dados voláteis divergem do último consolidado | Vale o dado em tempo real com indicação de horário da consulta; sem sobrescrever cadastro silenciosamente. |

---

## 7. Dados envolvidos (em termos de negócio, não técnicos)

| Dado | Descrição | Origem | Uso nesta jornada |
|---|---|---|---|
| Cliente raiz | Pessoa ou empresa identificada na busca (documento + contexto) | `busca-cliente/001` (entrada) | Raiz da página e de todas as consultas |
| Destaques e alertas | Nome, documento mascarado, segmento, saldo consolidado, alertas de risco/fraude, situação cadastral/score | Cadastro corporativo + motores de risco | Topo da página |
| Perfil e contatos | Contatos, telefones, e-mail, endereço, vínculos de 1º nível com papéis | Cadastro corporativo | Coluna esquerda + árvore |
| Carteira por família | Lista de vínculos ativos e inativos por Cartão/Conta/Consórcio/Investimentos, com situação | Base de produtos | Inventário central com abas |
| Detalhe volátil por ativo | Limites, fatura, saldo, PIX, assembleia, rentabilidade — conforme o tipo | Core bancário sob demanda | Painel de detalhe; nunca persistido |
| Ofertas elegíveis | Produto, condição, score/prioridade, validade, motivo de elegibilidade | Motor de propensão + oportunidades gravadas | Painel NBO top 3; recusa/aceite |
| Histórico de atendimentos | Casos recentes da conta (data, motivo, situação) | Base de atendimento | Lista somente leitura |
| Contexto de saída (aceite) | Oferta marcada em negociação + dados para a jornada de venda | Gerado nesta jornada | Entrada das futuras jornadas de venda por produto |

> Nenhum nome de objeto, campo ou componente técnico é mencionado aqui. O mapeamento para cadastros, ativos, ofertas e protocolos específicos ocorre em `plan.md` e na fundação.

---

## 8. Dependências

| Dependência | Tipo | Situação | Impacto nesta spec |
|---|---|---|---|
| `_fundacao/001` — Modelo de conta e segurança base | Fundação (gate rígido) | **Não iniciado** | Decide conta individual vs. household/grupo, titularidades e papéis — pré-requisito do `plan.md` técnico. Exploração de UX permitida; técnico só após a fundação. |
| `_fundacao/002` — Migração de dados | Fundação | **Não iniciado** | Base consolidada que esta tela lê (dependência declarada no BACKLOG). |
| `busca-cliente/001` — contexto fixado (local, gitignored) | Domínio produtor | Protótipo validado | Entrada: documento + produto/via/cota/posição; gatilho: clique no nome. Via dado, nunca via componente. **Dependência reversa a registrar:** o cartão da busca precisará tornar o nome clicável navegando para cá. |
| `docs/design-system/SYSTEM-DESIGN.md` | Fundação visual (gate leve) | **Não iniciado** | Defaults SLDS2 verificados até ratificação. |
| Motor de propensão (NBO) + core bancário | Integração | Premissa: interfaces a mapear em `plan.md` | Contratos de sincronização de ofertas e consulta volátil ficam para `plan.md`. |
| Futuras jornadas de venda por produto | Domínios consumidores | Não iniciadas | Recebem o aceite com contexto; não são pré-requisito. |

---

## 9. Perguntas em aberto — [NEEDS CLARIFICATION]

1. [NEEDS CLARIFICATION: último estado conhecido — com o motor NBO fora do ar, exibir as oportunidades já gravadas ou só o banner com retry?]
2. [NEEDS CLARIFICATION: limite de nós — household denso: máximo por nível na árvore resumida e na completa?]
3. [NEEDS CLARIFICATION: alternância de raiz — cliente com PF+PJ vinculadas: trocar a raiz sem voltar à busca?]
4. [NEEDS CLARIFICATION: destino temporário do aceite — enquanto a jornada de venda do produto não existe, para onde vai o aceite após marcar negociação? Texto exato?]
5. [NEEDS CLARIFICATION: fontes de KYC/score/alerta de fraude — quais campos e critérios disparam cada alerta do topo?]
6. [NEEDS CLARIFICATION: chaves PIX — exibir todas vinculadas ou só principais? Algum mascaramento?]
7. [NEEDS CLARIFICATION: multitarefa — operador pode manter detalhes de dois ativos abertos em paralelo (sub-abas) ou só um por vez?]

---

## 10. Notas para as próximas fases (não são requisitos, apenas rastreabilidade)

- Insumos técnicos vindos da conversa (registrar e justificar em `plan.md` sob Princípios IV/V/VI — a conversa é insumo, não decisão de spec): preferência por componentes padrão (destaques, árvore de relacionamentos, listas com abas, lista de casos); Apex somente na orquestração/integração (sem procedimentos empacotados); sincronização NBO com upsert idempotente + Queueable; cache client-side curto para voláteis; Named Credentials + gateway corporativo como referência de segurança; chave de idempotência `{documento}_{código}_{período}`; expiração com motivo; recusa com motivo rápido.
- Quando as respostas do §9 chegarem: `fsc-journey-spec-writer` fecha cenários/regras → `fsc-journey-ux-designer` desenha telas (padrão primeiro) → `fsc-html-prototyper` constrói `prototype/` → `fsc-journey-tech-planner` detalha `plan.md` técnico/`tasks.md`/`architecture.md` (após `_fundacao/001`).
- Dependência reversa a não esquecer: tornar o nome do cliente clicável no cartão da `busca-cliente/001` (P3) apontando para esta página.

---

*Fim de `spec.md` — `household-360/001` (especificada a partir de `visao360.md`, 2026-09-06)*
