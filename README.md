<p align="center">
  <img src="assets/banner.svg" width="960" alt="Salesforce Journey Factory">
</p>

<p align="center">
  <em>A f&aacute;brica que leva cada jornada do Financial Services Cloud de ideia a pronta-para-build &#8212; com governan&ccedil;a embutida.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/brunotrolo/Salesforce_Journey_Factory?style=flat-square&color=00A1E0&label=stars" alt="Stars">
  <img src="https://img.shields.io/badge/agentes-6-04E1CB?style=flat-square" alt="6 agentes">
  <img src="https://img.shields.io/badge/m%C3%A9todo-Spec--Driven%20Development-032D60?style=flat-square" alt="Spec-Driven Development">
  <img src="https://img.shields.io/badge/works%20with-Claude%20Code-032D60?style=flat-square" alt="Works with Claude Code">
  <img src="https://img.shields.io/badge/craft-Salesforce%20sf--skills-00A1E0?style=flat-square" alt="Salesforce sf-skills">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

<p align="center">
  <b>📄 README</b> &nbsp;·&nbsp; <a href="./docs/sdd/constitution.md">📜 Constituição</a> &nbsp;·&nbsp; <a href="./docs/sdd/DOMAINS.md">🧭 Domínios</a> &nbsp;·&nbsp; <a href="./docs/sdd/BACKLOG.md">🗂️ Backlog</a> &nbsp;·&nbsp; <a href="./LICENSE">⚖️ MIT License</a>
</p>

---

Fábrica de jornadas para a migração **Service Cloud → Financial Services Cloud**. Você aponta uma **capacidade** (uma tela, um componente, uma etapa de fluxo) de um **domínio** (Suporte, Cobrança, Vendas...) e seis agentes a conduzem até estar pronta para build — sem que ninguém precise adivinhar regra de negócio, estilo visual ou como as peças se conectam.

**Ciclo único com três portões:** cada capacidade percorre spec → design → protótipo → plano, e só é dada como pronta quando passa pelos três portões de governança:

```
spec.md → telas + tecnologia → protótipo LWC → plano técnico → tasks.md + architecture.md
              ↓                       ↓                                ↓
      Portão 1: padrão ou      Portão 2: o negócio          Portão 3: todo artefato
      customizado?             valida o protótipo           mapeado, com conexões
      (confirmação humana)     (confirmação humana)         resolvíveis
                                                                     ↓
                                                            pronto para build
```

**Como funciona:**
- **Craft** (Apex, LWC, OmniStudio, SLDS2) → skills oficiais da Salesforce importadas neste projeto, em `.claude/skills/` — curadas para o essencial (6 skills; ver `.claude/skills/README.md`), não uma cópia completa da biblioteca oficial.
- **Orquestração** (o ciclo, os portões, a fronteira de domínio, o mapa de artefatos) → nossos 6 agentes em `.claude/agents/`, com as regras não-negociáveis numa fonte única: [`docs/sdd/constitution.md`](./docs/sdd/constitution.md).

Ao final, cada capacidade tem cinco artefatos na própria pasta — e o critério de conclusão é que **um agente novo, sem nenhum contexto de como eles foram produzidos, consiga construir a capacidade só com eles**:

| Artefato | O que é |
|---|---|
| `spec.md` | O quê e por quê, em linguagem de negócio, com cenários de aceite testáveis |
| `plan.md` | Como: modelo de dados, segurança, automação, integração, telas e tecnologia por passo |
| `tasks.md` | Tarefas de build, pequenas e ordenadas por dependência real |
| `architecture.md` | Mapa de todo artefato e suas conexões (chama / lê / escreve / consumido por) |
| `prototype/` | LWC real rodando sobre SLDS2 real (via `.claude/skills/salesforce-ux/design-system-2-starter-kit/`), para o negócio validar antes do build |

> `specs/_fundacao/` (modelo de dados, segurança, migração) é a exceção: não tem UI, então não passa por `plan.md` com telas nem por `prototype/` — só `spec.md`, `plan.md`, `tasks.md` e `architecture.md`.

> **Nota de arquitetura:** o sistema **não é monolítico**. Cada domínio é uma fronteira de
> micro-frontend independentemente implantável, e capacidades de domínios diferentes nunca
> compartilham estado de frontend — só contratos de dados/API explícitos. E como um dos
> motivos desta migração é uma org de origem excessivamente customizada, toda capacidade
> parte da hipótese de ser **100% padrão e declarativa**: LWC, FlexCard, OmniScript e Apex
> são exceção que precisa de justificativa registrada e confirmação humana (Portão 1).

---

## ⚡ Começo rápido

### 1. Pré-requisitos

- [Claude Code](https://docs.claude.com/en/docs/claude-code) (CLI, desktop ou web)
- Uma org destino com **Financial Services Cloud** provisionado (e OmniStudio, se for usar)
- **Node.js ≥ 20 + npm**, com acesso à internet na primeira instalação — necessário para o portão de protótipo (`fsc-html-prototyper` roda LWC real via Vite em `.claude/skills/salesforce-ux/design-system-2-starter-kit/`, ver pré-requisitos completos em `.claude/skills/salesforce-ux/README.md`). Sem isso, o ciclo trava no Portão 2.
- Fora isso, nada mais para a fase de SDD — [Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli) (`sf`) entra depois, na fase de build

### 2. Instale — UM comando

Rode **de dentro da pasta do seu projeto**:

**Windows (PowerShell):**
```powershell
git clone --depth 1 https://github.com/brunotrolo/Salesforce_Journey_Factory.git .jf-tmp; New-Item -ItemType Directory -Force .claude,docs,specs | Out-Null; Copy-Item -Recurse -Force .jf-tmp\.claude\* .claude\; Copy-Item -Recurse -Force .jf-tmp\docs\* docs\; Copy-Item -Recurse -Force .jf-tmp\specs\* specs\; Remove-Item -Recurse -Force .jf-tmp; Push-Location .claude\skills\salesforce-ux\design-system-2-starter-kit; npm install; Pop-Location
```

**Mac / Linux / Git Bash:**
```bash
git clone --depth 1 https://github.com/brunotrolo/Salesforce_Journey_Factory.git .jf-tmp && mkdir -p .claude docs specs && cp -r .jf-tmp/.claude/. .claude/ && cp -r .jf-tmp/docs/. docs/ && cp -r .jf-tmp/specs/. specs/ && rm -rf .jf-tmp && (cd .claude/skills/salesforce-ux/design-system-2-starter-kit && npm install)
```

Isso traz os **agentes** (`.claude/agents/`), as **skills** (`.claude/skills/`) e o **scaffold de governança** (`docs/sdd/`, `docs/design-system/`, `specs/`) — e já deixa o ambiente de protótipo LWC/SLDS2 instalado (`npm install` roda automaticamente; precisa de Node.js ≥ 20 e internet, ver pré-requisitos acima). Se preferir clonar o repositório e trabalhar dentro dele em vez de usar este comando, rode `npm install` em `.claude/skills/salesforce-ux/design-system-2-starter-kit/` manualmente uma vez. Também dá para pular esse passo: `fsc-html-prototyper` detecta que falta e instala sozinho na primeira vez que precisar (ver nota abaixo).

> **Para atualizar:** rode o mesmo comando de novo. Ele sobrescreve agentes e skills (incluindo o código-fonte do kit de protótipo) e reinstala as dependências; revise antes se você tiver editado a constituição ou o backlog, que são conteúdo *seu*. `fsc-html-prototyper` também verifica isso sozinho antes de construir qualquer tela (ver `.claude/agents/fsc-html-prototyper.md`) — se o `npm install` inicial não rodou, ou uma skill nova foi adicionada sem reinstalar, ele roda `npm install` na primeira vez que precisar, em vez de assumir que já está pronto.

### 2.5 Ver protótipos — sem precisar do Claude (validação de negócio)

Duplo clique em `abrir-prototipos.bat` na **raiz do projeto** — ele lê `specs/*/prototype`, garante `dist` (build só na primeira vez), sobe `vite preview` em `http://localhost:4173` e abre o **seletor + a jornada no Google Chrome** (não no Simple Browser do VS Code). Mantenha o terminal aberto; feche para parar.

Para uma única jornada, também funciona dentro do kit:

```bash
cd .claude/skills/salesforce-ux/design-system-2-starter-kit
npm run open -- /rota-da-capacidade   # ex: /demo
# Git Bash: MSYS_NO_PATHCONV=1 npm run open -- /rota  ou  npm run open -- rota
```

Detalhes em `.claude/skills/salesforce-ux/README.md` (seção Instalação).

### 3. Abra o Claude Code

```bash
claude
```

Os 6 agentes carregam automaticamente.

### 4. Use

Peça pelo **domínio + capacidade** — o domínio é a fronteira de deploy, então ele importa:

```
Use o fsc-sdd-orchestrator para especificar support 001 — intake e triagem de caso
```

ou naturalmente:
> "o que ainda falta especificar?"
> "inicie a spec da busca rápida por CPF"

**Primeira vez?** Comece pela fundação, que bloqueia todos os domínios:
```
Use o fsc-sdd-orchestrator para a capacidade _fundacao 001 — modelo de dados e segurança base
```

E ratifique o system design antes das primeiras telas:
```
Use o fsc-design-system-architect para ratificar o System Design
```

---

## 🔒 Governança

O que impede uma jornada de sair errada não é boa vontade — são portões que o orquestrador não contorna:

| Portão | Regra | Força |
|---|---|---|
| Fundação de dados | Nenhuma capacidade é planejada sobre um modelo de conta/licenciamento não decidido | **rígido** |
| System Design | Toda tela usa tokens e componentes de uma fonte única; sem ele, o desvio fica registrado | leve |
| Padrão antes de customizado | LWC/OmniStudio/Apex só com justificativa e confirmação humana | **rígido** |
| Protótipo valida | O negócio confirma o protótipo antes de existir plano técnico ou tarefas | **rígido** |
| Rastreabilidade | Todo cenário de aceite vira task; todo artefato vira linha no mapa de conexões | **rígido** |

Detalhes e o texto normativo em [`docs/sdd/constitution.md`](./docs/sdd/constitution.md).

---

## 📖 Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/sdd/constitution.md`](./docs/sdd/constitution.md) | Os 9 princípios não-negociáveis: fundação, padrão-primeiro, portões, rastreabilidade |
| [`docs/sdd/DOMAINS.md`](./docs/sdd/DOMAINS.md) | Registro de domínios (fronteiras de micro-frontend) e suas dependências |
| [`docs/sdd/BACKLOG.md`](./docs/sdd/BACKLOG.md) | Capacidades a especificar, agrupadas por domínio, com status |
| [`docs/design-system/SYSTEM-DESIGN.md`](./docs/design-system/SYSTEM-DESIGN.md) | Tokens, componentes padrão e catálogo de customização aprovada |
| [`specs/README.md`](./specs/README.md) | Convenção de pastas dos cinco artefatos por capacidade |
| [`.claude/agents/README.md`](./.claude/agents/README.md) | Os 6 agentes, o ciclo que executam e como pedir por eles |
| [`.claude/skills/README.md`](./.claude/skills/README.md) | Origem, curadoria e atribuição de cada skill importada |

---

<p align="center">
  ⭐ <b><a href="https://github.com/brunotrolo/Salesforce_Journey_Factory/stargazers">Dê uma star no repo</a></b> para ser avisado quando novas skills e melhorias saírem.
</p>

<p align="center">
  <sub>
    Craft de plataforma vindo das <b><a href="https://github.com/forcedotcom/sf-skills">skills oficiais da Salesforce</a></b> (<code>forcedotcom/sf-skills</code>, Apache-2.0) &nbsp;·&nbsp;
    <a href="https://github.com/github/spec-kit">Spec-Kit</a> &nbsp;·&nbsp;
    <a href="https://github.com/salesforce-ux/design-system-2-starter-kit">SLDS 2 Starter Kit</a> &nbsp;·&nbsp;
    <a href="https://docs.claude.com/en/docs/claude-code">Claude Code</a>
  </sub>
</p>

<p align="center">
  <sub>Orquestração, constituição e processo de SDD © <a href="https://github.com/brunotrolo">brunotrolo</a> · <a href="./LICENSE">MIT</a>. Skills importadas redistribuídas sob suas licenças originais (ver <code><a href="./.claude/skills/README.md">.claude/skills/README.md</a></code>).</sub>
</p>
