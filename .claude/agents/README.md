# Agentes de SDD — Service Cloud → FSC

Quatro subagentes do Claude Code, cada um consumindo um subconjunto das skills em `.claude/skills/` (ver `.claude/skills/README.md` para a origem de cada uma). O sistema não é monolítico: é organizado por **domínio** (fronteira de micro-frontend/produto — ver `docs/sdd/DOMAINS.md`), e cada domínio contém várias **capacidades** (uma tela, um componente, uma etapa de fluxo — ver `docs/sdd/BACKLOG.md` e `specs/README.md`). Os agentes trabalham nesse nível: uma capacidade por vez, dentro de um domínio.

```
fsc-sdd-orchestrator          orquestra o ciclo completo de UMA capacidade, delega aos 3 abaixo
├── fsc-journey-spec-writer   spec.md (o quê/porquê da capacidade, sem tecnologia)
├── fsc-journey-ux-designer   telas/passos da capacidade — checa padrão/declarativo primeiro, só decide LWC vs OmniScript vs FlexCard para o que sobra
└── fsc-journey-tech-planner  plan.md técnico (dados/segurança/automação/integração cross-domínio) + tasks.md
```

## Como iniciar

Peça pelo domínio + capacidade (não só pelo nome solto — o domínio define a fronteira de deploy):

> "Use o fsc-sdd-orchestrator para especificar `atendimento` 001 — intake e triagem de caso"

O orquestrador:
1. Confere `docs/sdd/DOMAINS.md` (domínio existe? do que depende?), `docs/sdd/BACKLOG.md` (a linha da capacidade, sob o domínio certo) e `docs/sdd/constitution.md` (bloqueia capacidades que dependem de decisões ainda em aberto na fundação).
2. Aciona `fsc-journey-spec-writer` → `fsc-journey-ux-designer`, gravando em `specs/<domínio>/<NNN>-<slug>/`.
3. **Para e pergunta ao usuário** sempre que `fsc-journey-ux-designer` classificar a capacidade como `misto` ou `100% customizado` — só segue para `fsc-journey-tech-planner` depois de confirmação explícita (ver "Padrão antes de customizado" abaixo).
4. Faz a checagem de rastreabilidade spec → plan → tasks, e verifica se a capacidade não cresceu para virar "o domínio inteiro" (sinal de que deveria virar várias linhas de backlog).

## Padrão antes de customizado

Um dos motivos da migração é que a org atual é excessivamente customizada. Por isso (constituição, Princípios III e V) toda capacidade parte da hipótese de ser resolvida com recursos **padrão e declarativos** do FSC — customização (LWC/FlexCard/OmniScript/Apex/objeto customizado) só entra onde isso está comprovadamente descartado, com justificativa registrada em `plan.md`. `fsc-journey-ux-designer` classifica cada capacidade como `100% padrão/declarativo`, `misto` ou `100% customizado`; o orquestrador nunca deixa uma classificação `misto`/`100% customizado` passar para o `tech-planner` sem confirmação do usuário.

Cada especialista também pode ser chamado sozinho (ex.: só revisão de UX de um componente já existente, incluindo checar acoplamento acidental entre domínios, sem passar pelo ciclo inteiro).

## Por que domínio importa aqui

Cada domínio corresponde, no build, a um artefato de UI implantável de forma independente (um LWR site/UI Bundle, um conjunto de OmniScripts+FlexCards, ou um pacote de LWCs). Os três especialistas têm instrução explícita para:
- nunca fazer uma capacidade "vazar" para cobrir o domínio inteiro (isso é sinal de quebrar em mais capacidades);
- reutilizar componentes **dentro** do mesmo domínio, mas nunca acoplar diretamente a um componente de **outro** domínio — a integração entre domínios é sempre um contrato de dados/API explícito, nunca estado de frontend compartilhado;
- tratar `specs/_fundacao/` como a única dependência compartilhada legítima (modelo de dados e segurança base).

## Importante sobre as skills referenciadas

As skills em `.claude/skills/salesforce/`, `.claude/skills/agent-skills/`, `.claude/skills/mattpocock/` e `.claude/skills/ui-ux-pro-max/` estão dois níveis de profundidade (`.claude/skills/<origem>/<skill>/SKILL.md`) porque foram importadas todas dentro de uma única pasta por origem. O Claude Code pode não descobrir automaticamente skills nesse nível como slash-skills invocáveis — por isso os agentes acima têm instrução explícita de abrir esses arquivos com `Read`/`Grep` como base de conhecimento, não de esperar invocá-los via ferramenta de skill.
