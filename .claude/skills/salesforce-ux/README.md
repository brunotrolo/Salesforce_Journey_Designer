# salesforce-ux/ — ambiente de prototipagem vendorizado

| Pasta | Origem | O que é | Curadoria |
|---|---|---|---|
| `design-system-2-starter-kit/` | [salesforce-ux/design-system-2-starter-kit](https://github.com/salesforce-ux/design-system-2-starter-kit) (Apache-2.0) | Ambiente local de prototipagem oficial da Salesforce: LWC real + Vite + SLDS2 (tema "Cosmos") + Lightning Base Components, com DOM sombreado sintético — o mesmo motor de renderização usado pelo Salesforce de verdade. | Vendorizado sem alteração de código (só removidos `.git/`, `node_modules/`, `dist/`, `.vite/` — recriados por `npm install`/`npm run dev`). |

Vive dentro de `.claude/skills/` (não numa pasta `tools/` solta na raiz) pelo mesmo motivo de toda skill importada aqui: é contexto que os agentes (`fsc-html-prototyper`, `fsc-design-system-architect`) precisam enxergar como parte do conjunto de skills do projeto, não uma ferramenta externa desconectada.

## Por que isto existe

Antes desta pasta, o `fsc-html-prototyper` gerava HTML/CSS estático tentando *aproximar* visualmente o SLDS usando uma skill de design web genérica (`ui-ux-pro-max`, removida do projeto). O resultado não parecia uma tela Salesforce de verdade — porque não era: era uma aproximação manual, sem o motor de renderização real do Lightning.

O `design-system-2-starter-kit` resolve isso na raiz: como ele roda LWC real sobre SLDS2 real, qualquer protótipo construído aqui **é** uma tela Lightning, pixel a pixel — não uma imitação. Ver `.claude/agents/fsc-html-prototyper.md` para como cada capacidade usa este ambiente.

## Como o conceito de domínio mapeia para este starter kit

O starter kit organiza rotas em **"apps"** (`src/apps.config.js`) — um agrupamento de páginas com prefixo de URL e navegação próprios. Isso corresponde exatamente ao nosso conceito de **domínio** (`docs/sdd/DOMAINS.md`): cada domínio vira um "app" aqui, e cada capacidade do domínio vira uma página (`src/modules/page/<nome>/`) registrada nesse app — reforçando visualmente, no próprio protótipo, a fronteira de micro-frontend que a arquitetura já impõe.

## Instalação (uma vez, local)

```bash
cd .claude/skills/salesforce-ux/design-system-2-starter-kit
npm install
npm run dev
```

Abre em `http://localhost:3000`. Novas páginas de capacidade aparecem conforme os agentes as adicionam (ver `.claude/agents/fsc-html-prototyper.md`).

## Skills que este kit já espera

O próprio `AGENTS.md` deste starter kit (preservado na vendorização) instrui: *"For ALL UI work, read `node_modules/@salesforce/afv-skills/skills/design-systems-slds-apply/SKILL.md` first."* — são as mesmas skills que já importamos em `.claude/skills/salesforce/design-systems-slds-apply/` e `design-systems-slds-validate/` (curadas de `forcedotcom/sf-skills`). Nossos agentes leem a cópia em `.claude/skills/`, não a de `node_modules/`, para não depender de `npm install` já ter rodado — mas o conteúdo é o mesmo, e é a confirmação oficial de que a curadoria original estava certa.
