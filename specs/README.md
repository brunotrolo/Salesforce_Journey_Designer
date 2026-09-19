# Specs de capacidades — organizadas por domínio

O sistema é composto por domínios independentes (micro-frontends/jornadas de produto — ver `docs/sdd/DOMAINS.md`), não por um app monolítico. A estrutura de pastas reflete isso:

```
specs/
├── _fundacao/                      infraestrutura compartilhada (não é um domínio de produto)
│   ├── 001-modelo-de-dados-e-seguranca/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── 002-migracao-de-dados-legados/
├── busca-cliente/                  domínio
│   ├── 001-busca-rapida-por-cpf-conta-telefone/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   ├── architecture.md       mapa de todo artefato + suas conexões (chama/lê/escreve/consumido por)
│   │   └── prototype/            código-fonte LWC real (copiado de .claude/skills/salesforce-ux/design-system-2-starter-kit/) + README de como rodar
│   └── 002-resultado-com-desambiguacao-de-household/
├── nbo/
│   └── 001-card-de-recomendacao-em-atendimento/
├── atendimento/
│   └── 001-intake-e-triagem-de-caso/
└── produto-consorcio/
    └── 001-contratacao-de-cota/
```

## Convenção

- `specs/<domínio>/<NNN>-<slug-da-capacidade>/{spec.md, plan.md, tasks.md, architecture.md, prototype/}` (+ `data-mapping.md`/`research.md` quando aplicável).
- `<domínio>` é o slug definido em `docs/sdd/DOMAINS.md`. Não crie uma capacidade em um domínio que ainda não está registrado lá.
- `NNN` é sequencial **dentro do domínio**, não global — `busca-cliente/001` e `atendimento/001` são capacidades diferentes, sem relação entre si pelo número.
- Cada pasta de capacidade é uma unidade independentemente especificável e, no fim do ciclo, independentemente implantável — evite uma capacidade que só faz sentido junto de outra; se isso acontecer, é sinal de que deveriam ser uma capacidade só, ou que a fronteira de domínio está errada.
- `prototype/` é uma cópia do(s) componente(s) LWC reais (sem dados reais, sem conexão de org) que o `fsc-html-prototyper` constrói em `.claude/skills/salesforce-ux/design-system-2-starter-kit/` — o ambiente vendorizado de prototipagem oficial da Salesforce (LWC + Vite + SLDS2 real, ver `.claude/skills/salesforce-ux/README.md`) — a partir de `plan.md`, usando os hooks/componentes de `docs/design-system/SYSTEM-DESIGN.md`. Por rodar SLDS2 de verdade via LWC, o protótipo renderiza como uma tela Lightning real, não uma aproximação. Existe para validar `spec.md` com o negócio antes do `tech-planner` rodar — ver constituição, Princípio VIII (gate rígido: sem confirmação do usuário no protótipo, não se avança para `tasks.md`).
- `architecture.md` é o mapa de artefatos e conexões da capacidade, gerado pelo `fsc-journey-tech-planner` junto com `tasks.md`: uma tabela com **todo** artefato concreto que `tasks.md` lista (objeto, campo, permission set, Flow, Apex, LWC, OmniScript, FlexCard — OmniStudio neste projeto é só esses dois, sem Integration Procedure/DataRaptor) e, para cada um, do que ele depende, o que ele chama, o que lê/escreve e quem o consome. É obrigatório, não opcional — existe para que um agente de build completamente novo (sem o contexto desta conversa) consiga implementar a capacidade sem ter que rededuzir as conexões a partir de `plan.md`. Ver constituição, Princípio IX.
- `specs/_fundacao/` é a exceção: não é um domínio de produto/micro-frontend, é a base de dados/segurança que todo domínio depende (ver `docs/sdd/DOMAINS.md`). Não tem `prototype/` — não é UI.
- Reservado em `docs/sdd/BACKLOG.md` antes de criar a pasta — não crie uma capacidade aqui sem antes adicionar/confirmar a linha correspondente no backlog, sob o domínio certo.
- Gerado e mantido pelos agentes em `.claude/agents/` (ver `.claude/agents/README.md`).
- A forma de `spec.md`/`plan.md`/`tasks.md`/`architecture.md` é a descrita nos próprios agentes (`.claude/agents/fsc-journey-*.md`) — **não** os arquivos `.claude/skills/spec-kit/templates/{spec,plan,tasks}-template.md`, que são o template genérico de projeto de software do Spec-Kit (User Stories com prioridade P1/P2/P3, estrutura `src/`/`tests/`/`frontend`/`backend`, placeholders do CLI `specify` que não importamos) e não se aplicam a uma capacidade Salesforce. O que aproveitamos do Spec-Kit é a metodologia (`.claude/skills/spec-kit/spec-driven.md`) e a disciplina de gates/rastreabilidade — não a forma literal dos arquivos.
