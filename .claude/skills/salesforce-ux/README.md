# salesforce-ux/ — ambiente de prototipagem vendorizado

| Pasta | Origem | O que é | Curadoria |
|---|---|---|---|
| `design-system-2-starter-kit/` | [salesforce-ux/design-system-2-starter-kit](https://github.com/salesforce-ux/design-system-2-starter-kit) (Apache-2.0) | Ambiente local de prototipagem oficial da Salesforce: LWC real + Vite + SLDS2 (tema "Cosmos") + Lightning Base Components, com DOM sombreado sintético — o mesmo motor de renderização usado pelo Salesforce de verdade. | Vendorizado sem alteração de código (só removidos `.git/`, `node_modules/`, `dist/`, `.vite/` — recriados por `npm install`/`npm run dev`). |

Vive dentro de `.claude/skills/` (não numa pasta `tools/` solta na raiz): é contexto que os agentes (`fsc-html-prototyper`, `fsc-design-system-architect`) precisam enxergar como parte do conjunto de skills do projeto, não uma ferramenta externa desconectada.

Como ele roda LWC real sobre SLDS2 real, qualquer protótipo construído aqui **é** uma tela Lightning, pixel a pixel — não uma aproximação. Ver `.claude/agents/fsc-html-prototyper.md` para como cada capacidade usa este ambiente.

## Como o conceito de domínio mapeia para este starter kit

O starter kit organiza rotas em **"apps"** (`src/apps.config.js`) — um agrupamento de páginas com prefixo de URL e navegação próprios. Isso corresponde exatamente ao nosso conceito de **domínio** (`docs/sdd/DOMAINS.md`): cada domínio vira um "app" aqui, e cada capacidade do domínio vira uma página (`src/modules/page/<nome>/`) registrada nesse app — reforçando visualmente, no próprio protótipo, a fronteira de micro-frontend que a arquitetura já impõe.

## Pré-requisitos

- **Node.js ≥ 20** (`.nvmrc` e `package.json` `engines.node` deste kit pedem isso) — `nvm use` se você usa nvm, ou confirme `node -v`.
- **npm** (vem com o Node).
- **Acesso à internet no momento do `npm install`**: este kit é vendorizado como **código-fonte**, não como `node_modules/` pronto. As dependências reais — `@salesforce-ux/design-system` e `@salesforce-ux/design-system-2` (SLDS2 de verdade), `lwc`, `@lwc/synthetic-shadow`, `lightning-base-components`, e `@salesforce/afv-skills` (as mesmas skills SLDS já importadas em `.claude/skills/salesforce/`) — vêm do registro público do npm em tempo de instalação. Sem rede nesse momento, `npm install` falha e o ambiente não roda.
- Depois do primeiro `npm install`, rodar/reconstruir não precisa mais de rede (a menos que `package-lock.json` mude).

## Instalação

**O comando de instalação do projeto (`README.md` raiz, seção "Começo rápido") já roda o `npm install` deste kit automaticamente** — não é um passo manual separado no fluxo normal. Isso existe porque a garantia de que o SLDS2 está instalado não pode depender de alguém lembrar de um passo extra: ou o comando de instalação do projeto já deixa pronto, ou (fallback) o próprio `fsc-html-prototyper` verifica e instala sozinho na primeira vez que precisar (ver Process, passo 3, em `.claude/agents/fsc-html-prototyper.md` — checa se `node_modules/` existe, roda `npm install` se não existir, e para com erro claro se isso falhar por falta de rede ou versão de Node). Nenhum dos dois caminhos assume silenciosamente que já está instalado.

### Caminho fácil — abrir protótipos (recomendado para validação de negócio)

Duplo clique em `abrir-prototipos.bat` na **raiz do projeto** — ele lê `specs/*/prototype`, garante `dist` (build só se faltar), sobe `vite preview` em `http://localhost:4173` e abre o seletor + a jornada no **Google Chrome** (não no Simple Browser do VS Code). Veja `design-system-2-starter-kit/scripts/open-prototypes.mjs` para detalhes. Para uma única jornada, também funciona:

> **Regra de casa:** nenhum arquivo de jornada mora neste kit — a fonte única é sempre `specs/<dominio>/<cap>/prototype/`. O kit recebe overlay temporário via `scripts/restore-prototype.mjs` (com `--clean` obrigatório ao final). `dist/` é cache local gitignored: após mudar qualquer protótipo, rebuild com o overlay aplicado, senão o preview serve código velho.

```bash
cd .claude/skills/salesforce-ux/design-system-2-starter-kit
npm run open -- /rota-da-capacidade   # ex: /busca-cliente
# ou duplo clique em abrir-prototipo.cmd / .sh na raiz do kit
```

`npm run open` (launcher `scripts/open-prototype.mjs`) garante `npm install` se `node_modules/` não existir, lista as rotas de `src/routes.config.js`, sobe o dev server, faz polling em `http://localhost:3000/` até responder e só então abre o navegador na rota pedida (com fallback para `3001/3002` se `3000` estiver ocupada). No Git Bash use `MSYS_NO_PATHCONV=1 npm run open -- /rota` ou `npm run open -- rota` (sem barra inicial) para evitar conversão de caminho. Mantenha o terminal aberto; feche ou `Ctrl+C` para parar.

### Caminho manual — dev local

```bash
cd .claude/skills/salesforce-ux/design-system-2-starter-kit
npm install   # só necessário se node_modules/ não existir ou package-lock.json mudou
npm run dev   # abre em http://localhost:3000
```

Novas páginas aparecem conforme os agentes as adicionam (ver `.claude/agents/fsc-html-prototyper.md`).

Para verificar que uma alteração compila de verdade (o que `fsc-html-prototyper` faz antes de reportar uma tela como pronta): `npm run build` — roda o mesmo pipeline LWC/Vite de produção e falha alto se houver erro de compilação, em vez de só "parecer" certo no source. Para validar o build já servido: `npm run preview -- --open /rota`.

## Skills que este kit já espera

O próprio `AGENTS.md` deste starter kit (preservado na vendorização) instrui: *"For ALL UI work, read `node_modules/@salesforce/afv-skills/skills/design-systems-slds-apply/SKILL.md` first."* — é a mesma skill já importada em `.claude/skills/salesforce/design-systems-slds-apply/`. Nossos agentes leem a cópia em `.claude/skills/`, não a de `node_modules/`, para não depender de `npm install` já ter rodado.
