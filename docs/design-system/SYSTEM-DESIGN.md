# System Design — Salesforce Journey Designer

Status: **não iniciado — nenhuma capacidade deve ser considerada "consistente" visualmente até este documento existir e ser ratificado**

Produzido e mantido pelo agente `fsc-design-system-architect` (ver `.claude/agents/fsc-design-system-architect.md`), usando as skills `design-systems-slds-apply`/`design-systems-slds-validate` importadas em `.claude/skills/salesforce/`, e o ambiente vendorizado `.claude/skills/salesforce-ux/design-system-2-starter-kit/` (SLDS2 real via LWC/Vite). Não é produzido por capacidade nem por domínio — é fundação, no mesmo sentido que `docs/sdd/constitution.md` é fundação para dados: existe uma vez, todo domínio o consome. A única fonte de verdade visual aqui é o **SLDS2 real** (hooks, blueprints e Lightning Base Components verificados) — nunca uma paleta ou tipografia inventada.

Gate: **leve** (ver `docs/sdd/constitution.md`, Princípio II). Enquanto este documento estiver "não iniciado" ou "rascunho", `fsc-journey-ux-designer` pode desenhar telas de capacidades, mas é obrigado a registrar em cada `plan.md` um aviso explícito de que o desenho não foi validado contra um System Design ratificado — para que a dívida de consistência fique visível, não escondida.

## 1. Tokens (hooks SLDS2)

- Não é uma paleta inventada: são os **hooks reais do SLDS2** (`--slds-g-color-*`, `--slds-g-spacing-*`, `--slds-g-font-scale-*` etc.) que este projeto usa, verificados via `search-hooks.cjs` da skill `design-systems-slds-apply`.
- A única decisão de negócio real aqui é o **mapeamento de marca**: a cor de destaque da organização mapeia para qual família de hook de accent do SLDS2 (`--slds-g-color-accent-*`)? Ou o visual "Cosmos" nativo do Salesforce é aceitável como está?
- [A preencher pelo `fsc-design-system-architect` — só a pergunta de mapeamento de marca depende do negócio; o resto é catálogo verificado do SLDS2.]

## 2. Inventário de componentes padrão

- Hierarquia de seleção da skill `design-systems-slds-apply`: **Lightning Base Components → SLDS Blueprints → Styling Hooks → CSS customizado** (último recurso). Esta seção lista quais LBCs/blueprints cobrem os padrões de tela mais comuns do FSC (list view, detalhe de registro, resultado de busca, formulário, modal) — reforça a Regra IV da constituição (padrão/declarativo primeiro).
- [A preencher.]

## 3. Catálogo de padrões customizados aprovados

- Para a minoria de telas que precisam de LWC/FlexCard/OmniScript (Regra IV/V da constituição): um catálogo **fechado** de padrões customizados aprovados, cada um construído só com hooks/blueprints verificados do SLDS2 — nunca markup inventado. Referência: `.claude/skills/salesforce-ux/design-system-2-starter-kit/src/modules/ui/` e o próprio `AGENTS.md` desse ambiente (sem `!important`, sem `style` inline, formulários e modais sempre via Lightning Base Components).
- Cada padrão novo que uma capacidade precisar e que não estiver aqui é uma revisão deste documento, não uma decisão isolada do `fsc-journey-ux-designer` ou do `fsc-html-prototyper`.
- [A preencher.]

## 4. Estados e padrões de interação

- Vazio, carregando, erro, sucesso — como cada um se parece em componente padrão e em componente customizado.
- Navegação entre passos (OmniScript) vs. entre páginas (LWC/Lightning page) vs. cartões de contexto (FlexCard) — como o usuário percebe que está na mesma "jornada".
- [A preencher.]

## 5. Responsividade e acessibilidade

- Regras de layout responsivo (desktop agente vs. mobile Field Service/Experience Cloud, se aplicável).
- Baseline de acessibilidade (WCAG): a garantia principal é preferir Lightning Base Components a blueprint feito à mão — LBCs carregam o comportamento de acessibilidade nativo do Salesforce. Para a minoria de casos que precisa de padrão customizado, use `.claude/skills/salesforce/experience-lwc-generate/references/accessibility-guide.md` (guia WCAG 2.1 AA: HTML semântico, ARIA, teclado, foco, contraste, leitor de tela). O scorecard `design-systems-slds-validate` também pontua acessibilidade, mas só checa presença de atributo (labels, alt text, foco) — não contraste, teclado ou leitor de tela — então trate um score alto ali como piso, não como comprovação de acessibilidade.
- [A preencher.]

## 6. Como este documento é usado no ciclo

- `fsc-journey-ux-designer` consome as seções 1–5 como restrição ao desenhar uma capacidade — escolhe entre o que já está aprovado aqui, não inventa novo estilo por capacidade.
- `fsc-html-prototyper` usa os hooks/componentes daqui ao construir o protótipo LWC de cada capacidade em `.claude/skills/salesforce-ux/design-system-2-starter-kit/` — enquanto o documento estiver incompleto, o protótipo usa defaults verificados do SLDS2 e sinaliza isso explicitamente.
- Toda vez que uma capacidade precisar de algo que não está coberto aqui (hook novo, componente customizado novo), isso é reportado como uma proposta de revisão deste documento, não resolvido silenciosamente dentro da spec da capacidade.

**Version**: não ratificado | **Ratified**: pendente | **Last Amended**: pendente
