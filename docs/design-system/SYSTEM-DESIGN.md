# System Design — Salesforce Journey Factory

Status: **não iniciado — nenhuma capacidade deve ser considerada "consistente" visualmente até este documento existir e ser ratificado**

Produzido e mantido pelo agente `fsc-design-system-architect` (ver `.claude/agents/fsc-design-system-architect.md`), usando as skills `ui-ux-pro-max` e as skills SLDS importadas (`design-systems-slds-apply`, `design-systems-slds-validate`, `design-systems-slds2-migrate`) em `.claude/skills/`. Não é produzido por capacidade nem por domínio — é fundação, no mesmo sentido que `docs/sdd/constitution.md` é fundação para dados: existe uma vez, todo domínio o consome.

Gate: **leve** (ver `docs/sdd/constitution.md`, Princípio II). Enquanto este documento estiver "não iniciado" ou "rascunho", `fsc-journey-ux-designer` pode desenhar telas de capacidades, mas é obrigado a registrar em cada `plan.md` um aviso explícito de que o desenho não foi validado contra um System Design ratificado — para que a dívida de consistência fique visível, não escondida.

## 1. Tokens

- Cor (paleta primária/semântica: sucesso, alerta, erro, informação), tipografia (família, escala), espaçamento, elevação/sombra, raio de borda.
- Base: tokens nativos do SLDS/SLDS2 — este documento define quais tokens do SLDS o projeto usa e como (não reinventa uma paleta paralela).
- [A preencher pelo `fsc-design-system-architect` — depende de identidade visual/marca que só o negócio define.]

## 2. Inventário de componentes padrão

- Lista dos componentes padrão do Lightning/FSC (page layouts, list views, related lists, ações padrão, componentes dinâmicos do App Builder) que cobrem a maioria das telas — reforça a Regra III da constituição (padrão/declarativo primeiro).
- [A preencher.]

## 3. Catálogo de padrões customizados aprovados

- Para a minoria de telas que precisam de LWC/FlexCard/OmniScript (Regra III/IV da constituição): um catálogo **fechado** de padrões visuais aprovados para esses componentes, para que a exceção também seja sistematizada — não reinventada capacidade a capacidade.
- Cada padrão novo que uma capacidade precisar e que não estiver aqui é uma revisão deste documento, não uma decisão isolada do `fsc-journey-ux-designer`.
- [A preencher.]

## 4. Estados e padrões de interação

- Vazio, carregando, erro, sucesso — como cada um se parece em componente padrão e em componente customizado.
- Navegação entre passos (OmniScript) vs. entre páginas (LWC/Lightning page) vs. cartões de contexto (FlexCard) — como o usuário percebe que está na mesma "jornada".
- [A preencher.]

## 5. Responsividade e acessibilidade

- Regras de layout responsivo (desktop agente vs. mobile Field Service/Experience Cloud, se aplicável).
- Baseline de acessibilidade (WCAG) — ver skills `experience-accessibility-validate` e `experience-lwc-accessibility-jest-run`.
- [A preencher.]

## 6. Como este documento é usado no ciclo

- `fsc-journey-ux-designer` consome as seções 1–5 como restrição ao desenhar uma capacidade — escolhe entre o que já está aprovado aqui, não inventa novo estilo por capacidade.
- `fsc-html-prototyper` usa os tokens/componentes daqui para gerar o protótipo HTML de cada capacidade — enquanto o documento estiver incompleto, o protótipo usa um conjunto mínimo de defaults e sinaliza isso explicitamente.
- Toda vez que uma capacidade precisar de algo que não está coberto aqui (token novo, componente customizado novo), isso é reportado como uma proposta de revisão deste documento, não resolvido silenciosamente dentro da spec da capacidade.

**Version**: não ratificado | **Ratified**: pendente | **Last Amended**: pendente
