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
│   │   └── prototype/            HTML/CSS estático e navegável, gerado pelo fsc-html-prototyper
│   └── 002-resultado-com-desambiguacao-de-household/
├── nbo/
│   └── 001-card-de-recomendacao-em-atendimento/
├── atendimento/
│   └── 001-intake-e-triagem-de-caso/
└── produto-consorcio/
    └── 001-contratacao-de-cota/
```

## Convenção

- `specs/<domínio>/<NNN>-<slug-da-capacidade>/{spec.md, plan.md, tasks.md, prototype/}` (+ `data-mapping.md`/`research.md` quando aplicável).
- `<domínio>` é o slug definido em `docs/sdd/DOMAINS.md`. Não crie uma capacidade em um domínio que ainda não está registrado lá.
- `NNN` é sequencial **dentro do domínio**, não global — `busca-cliente/001` e `atendimento/001` são capacidades diferentes, sem relação entre si pelo número.
- Cada pasta de capacidade é uma unidade independentemente especificável e, no fim do ciclo, independentemente implantável — evite uma capacidade que só faz sentido junto de outra; se isso acontecer, é sinal de que deveriam ser uma capacidade só, ou que a fronteira de domínio está errada.
- `prototype/` é HTML/CSS estático (sem framework, sem dados reais), gerado pelo `fsc-html-prototyper` a partir de `plan.md`, usando os tokens/componentes de `docs/design-system/SYSTEM-DESIGN.md`. Existe para validar `spec.md` com o negócio antes do `tech-planner` rodar — ver constituição, Princípio VIII (gate rígido: sem confirmação do usuário no protótipo, não se avança para `tasks.md`).
- `specs/_fundacao/` é a exceção: não é um domínio de produto/micro-frontend, é a base de dados/segurança que todo domínio depende (ver `docs/sdd/DOMAINS.md`). Não tem `prototype/` — não é UI.
- Reservado em `docs/sdd/BACKLOG.md` antes de criar a pasta — não crie uma capacidade aqui sem antes adicionar/confirmar a linha correspondente no backlog, sob o domínio certo.
- Gerado e mantido pelos agentes em `.claude/agents/` (ver `.claude/agents/README.md`).
- Templates de origem: `.claude/skills/spec-kit/templates/{spec,plan,tasks}-template.md`.
