# Agentes de SDD — Service Cloud → FSC

Quatro subagentes do Claude Code, cada um consumindo um subconjunto das skills em `.claude/skills/` (ver `.claude/skills/README.md` para a origem de cada uma).

```
fsc-sdd-orchestrator          orquestra o ciclo completo por jornada, delega aos 3 abaixo
├── fsc-journey-spec-writer   spec.md (o quê/porquê, sem tecnologia)
├── fsc-journey-ux-designer   passos da jornada + LWC vs OmniScript vs FlexCard por passo
└── fsc-journey-tech-planner  plan.md técnico (dados/segurança/automação) + tasks.md
```

## Como iniciar

Peça diretamente pelo nome da jornada ou ID do backlog:

> "Use o fsc-sdd-orchestrator para especificar a jornada 003 — intake de caso de serviço"

O orquestrador:
1. Confere `docs/sdd/BACKLOG.md` e `docs/sdd/constitution.md` (bloqueia jornadas que dependem de decisões ainda em aberto na fundação).
2. Aciona `fsc-journey-spec-writer` → `fsc-journey-ux-designer` → `fsc-journey-tech-planner`, nessa ordem, gravando em `specs/<NNN>-<slug>/`.
3. Faz a checagem de rastreabilidade spec → plan → tasks antes de marcar a jornada como pronta.

Cada especialista também pode ser chamado sozinho (ex.: só revisão de UX de um componente já existente, sem passar pelo ciclo inteiro).

## Importante sobre as skills referenciadas

As skills em `.claude/skills/salesforce/`, `.claude/skills/agent-skills/`, `.claude/skills/mattpocock/` e `.claude/skills/ui-ux-pro-max/` estão dois níveis de profundidade (`.claude/skills/<origem>/<skill>/SKILL.md`) porque foram importadas todas dentro de uma única pasta por origem. O Claude Code pode não descobrir automaticamente skills nesse nível como slash-skills invocáveis — por isso os agentes acima têm instrução explícita de abrir esses arquivos com `Read`/`Grep` como base de conhecimento, não de esperar invocá-los via ferramenta de skill.
