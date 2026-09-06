# Agentes de SDD — Salesforce Journey Factory (Service Cloud → FSC)

Seis subagentes do Claude Code, cada um consumindo um subconjunto das skills em `.claude/skills/` (ver `.claude/skills/README.md` para a origem de cada uma). O sistema não é monolítico: é organizado por **domínio** (fronteira de micro-frontend/produto — ver `docs/sdd/DOMAINS.md`), e cada domínio contém várias **capacidades** (uma tela, um componente, uma etapa de fluxo — ver `docs/sdd/BACKLOG.md` e `specs/README.md`). Um agente — `fsc-design-system-architect` — roda uma vez para o projeto inteiro; os outros cinco trabalham por capacidade, dentro de um domínio.

```
fsc-design-system-architect   roda 1x (não por capacidade): docs/design-system/SYSTEM-DESIGN.md — tokens/componentes únicos do projeto

fsc-sdd-orchestrator          orquestra o ciclo completo de UMA capacidade, delega aos 4 abaixo
├── fsc-journey-spec-writer   spec.md (o quê/porquê da capacidade, sem tecnologia)
├── fsc-journey-ux-designer   telas/passos — consome o System Design, checa padrão/declarativo primeiro, só decide LWC vs OmniScript vs FlexCard para o que sobra
├── fsc-html-prototyper       protótipo LWC real sobre SLDS2 real (.claude/skills/salesforce-ux/design-system-2-starter-kit/), para validar spec.md com o negócio
└── fsc-journey-tech-planner  plan.md técnico (dados/segurança/automação/integração cross-domínio) + tasks.md + architecture.md (mapa de artefatos e conexões)
```

## Como iniciar

Peça pelo domínio + capacidade (não só pelo nome solto — o domínio define a fronteira de deploy):

> "Use o fsc-sdd-orchestrator para especificar `support` 001 — intake e triagem de caso"

O orquestrador roda, por capacidade:
1. Confere `docs/sdd/DOMAINS.md` (domínio existe? do que depende?), `docs/sdd/BACKLOG.md` (a linha da capacidade, sob o domínio certo) e `docs/sdd/constitution.md` (bloqueia capacidades que dependem de decisões ainda em aberto na fundação de dados — gate rígido).
2. Aciona `fsc-journey-spec-writer` → `fsc-journey-ux-designer`, gravando em `specs/<domínio>/<NNN>-<slug>/`. Antes do desenho de tela, avisa (sem bloquear) se `docs/design-system/SYSTEM-DESIGN.md` ainda não estiver ratificado.
3. **Para e pergunta ao usuário** sempre que `fsc-journey-ux-designer` classificar a capacidade como `misto` ou `100% customizado` — só segue depois de confirmação explícita (ver "Padrão antes de customizado" abaixo). Gate rígido.
4. Aciona `fsc-html-prototyper`, que gera o protótipo em `specs/<domínio>/<NNN>-<slug>/prototype/`. **Para de novo** e só segue para `fsc-journey-tech-planner` depois que o usuário confirmar que o protótipo corresponde ao esperado (ver "Protótipo antes do plano técnico" abaixo). Gate rígido.
5. Aciona `fsc-journey-tech-planner`, que produz `plan.md`, `tasks.md` **e** `architecture.md` (mapa de artefatos e conexões). Faz a checagem de rastreabilidade spec → plan → tasks → architecture → protótipo — todo artefato de `tasks.md` precisa ter linha em `architecture.md` com conexões resolvíveis, não vagas — e verifica se a capacidade não cresceu para virar "o domínio inteiro" (sinal de que deveria virar várias linhas de backlog).

**Exceção `_fundacao/`:** capacidades de `specs/_fundacao/` (modelo de dados, segurança, migração) não têm UI. O orquestrador pula os passos 2–4 de `fsc-journey-ux-designer`/`fsc-html-prototyper` inteiramente e vai direto do `spec.md` confirmado para `fsc-journey-tech-planner` — nada de tela, classificação padrão/customizado ou `prototype/` para elas.

Cada especialista também pode ser chamado sozinho (ex.: só revisão de UX de um componente já existente, ou só ratificar o System Design, sem passar pelo ciclo inteiro).

## Padrão antes de customizado (gate rígido)

Um dos motivos da migração é que a org atual é excessivamente customizada. Por isso (constituição, Princípios IV e VI) toda capacidade parte da hipótese de ser resolvida com recursos **padrão e declarativos** do FSC — customização (LWC/FlexCard/OmniScript/Apex/objeto customizado) só entra onde isso está comprovadamente descartado, com justificativa registrada em `plan.md`. `fsc-journey-ux-designer` classifica cada capacidade como `100% padrão/declarativo`, `misto` ou `100% customizado`; o orquestrador nunca deixa uma classificação `misto`/`100% customizado` passar adiante sem confirmação do usuário.

## System Design único (gate leve) + Protótipo antes do plano técnico (gate rígido)

Dois mecanismos fecham o loop entre spec, design e build:

- **System Design** (`docs/design-system/SYSTEM-DESIGN.md`, mantido por `fsc-design-system-architect`): hooks/blueprints/LBCs reais do SLDS2 que o projeto usa, mais um catálogo fechado de padrões customizados aprovados — nenhum domínio ou capacidade inventa seu próprio estilo. Fundamentado exclusivamente em `.claude/skills/salesforce/design-systems-slds-apply/`. Gate **leve** (constituição, Princípio II): uma capacidade pode ser desenhada antes de ele estar ratificado, mas isso é sempre registrado explicitamente em `plan.md`, nunca escondido.
- **Protótipo LWC real** (`fsc-html-prototyper`, construído em `.claude/skills/salesforce-ux/design-system-2-starter-kit/` — o ambiente vendorizado de prototipagem oficial da Salesforce, LWC + Vite + SLDS2 real — e copiado para `specs/<domínio>/<NNN>-<slug>/prototype/`): não é uma aproximação em HTML/CSS estático; é LWC de verdade rodando sobre SLDS2 de verdade, então renderiza pixel a pixel como uma tela Lightning real. Cobre todos os cenários de aceite do `spec.md`, passa pelo linter oficial do SLDS e por um scorecard (`design-systems-slds-validate`, meta ≥ B) antes de ser dado como pronto. Gate **rígido** (constituição, Princípio VIII): o `fsc-sdd-orchestrator` exige confirmação explícita do usuário contra o protótipo antes de acionar `fsc-journey-tech-planner` — o objetivo é descobrir um erro de spec ou de tela enquanto ainda é barato corrigir, não depois que `tasks.md` já existe.

## Architecture.md — o SDD tem que sobreviver sem esta conversa

O objetivo final de cada capacidade é um conjunto de arquivos (`spec.md`, `plan.md`, `tasks.md`, `architecture.md`, e `prototype/` quando a capacidade tem UI — `specs/_fundacao/` não tem, então pula direto para `plan.md`/`tasks.md`/`architecture.md` sem `prototype/`) que um agente **diferente**, numa sessão **diferente**, sem nenhum contexto desta conversa, consegue pegar e construir corretamente. `plan.md`/`tasks.md` dizem o quê construir; sozinhos, não deixam explícito como as peças se conectam. `architecture.md` (produzido por `fsc-journey-tech-planner`, verificado pelo `fsc-sdd-orchestrator` no passo de Analyze) é exatamente isso: uma tabela com todo artefato de `tasks.md` e, para cada um, do que ele depende, o que chama/é chamado, o que lê/escreve, e quem o consome — nunca uma referência vaga a "o backend". Constituição, Princípio IX (NON-NEGOTIABLE).

## Por que domínio importa aqui

Cada domínio corresponde, no build, a um artefato de UI implantável de forma independente (um LWR site/UI Bundle, um conjunto de OmniScripts+FlexCards, ou um pacote de LWCs). Os especialistas têm instrução explícita para:
- nunca fazer uma capacidade "vazar" para cobrir o domínio inteiro (isso é sinal de quebrar em mais capacidades);
- reutilizar componentes **dentro** do mesmo domínio, mas nunca acoplar diretamente a um componente de **outro** domínio — a integração entre domínios é sempre um contrato de dados/API explícito, nunca estado de frontend compartilhado;
- tratar `specs/_fundacao/` (dados/segurança) e `docs/design-system/SYSTEM-DESIGN.md` (visual) como as únicas duas dependências compartilhadas legítimas — uma por domínio de negócio, a outra por domínio de produto (UI).

## Importante sobre as skills referenciadas

As skills em `.claude/skills/salesforce/`, `.claude/skills/agent-skills/` e `.claude/skills/mattpocock/` estão dois níveis de profundidade (`.claude/skills/<origem>/<skill>/SKILL.md`) porque foram importadas todas dentro de uma única pasta por origem. O Claude Code pode não descobrir automaticamente skills nesse nível como slash-skills invocáveis — por isso os agentes acima têm instrução explícita de abrir esses arquivos com `Read`/`Grep` como base de conhecimento, não de esperar invocá-los via ferramenta de skill.
