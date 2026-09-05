# Salesforce Journey Factory

Fundação de Spec-Driven Development (SDD) para a migração Service Cloud → Financial Services Cloud (FSC): skills importadas, agentes especialistas e o processo que transforma cada capacidade de cada domínio em spec → design → protótipo → plano técnico → tarefas de build.

## O que o processo entrega

Cada **capacidade** (uma tela, um componente, uma etapa de fluxo) de cada **domínio** (fronteira de micro-frontend) termina o ciclo com cinco artefatos na sua própria pasta em `specs/<domínio>/<NNN>-<slug>/`:

| Artefato | O que é |
|---|---|
| `spec.md` | O quê e por quê, em linguagem de negócio, com cenários de aceite testáveis |
| `plan.md` | Como: modelo de dados, segurança, automação, integração, telas e escolha de tecnologia por passo |
| `tasks.md` | Tarefas de build, pequenas e ordenadas por dependência real |
| `architecture.md` | Mapa de todo artefato e suas conexões (chama / lê / escreve / consumido por) |
| `prototype/` | HTML/CSS estático e navegável, para o negócio validar antes do build |

O critério de "pronto para build" é que um agente novo, sem nenhum contexto de como esses arquivos foram produzidos, consiga construir a capacidade só com eles.

## Comece por aqui

- `docs/sdd/constitution.md` — regras não-negociáveis do projeto (modelo de dados, padrão-antes-de-customizado, gates de fundação).
- `docs/sdd/DOMAINS.md` — domínios (fronteiras de micro-frontend) e do que cada um depende.
- `docs/sdd/BACKLOG.md` — capacidades a especificar, por domínio.
- `docs/design-system/SYSTEM-DESIGN.md` — o system design único (tokens, componentes, padrões) que toda tela do projeto usa.
- `specs/README.md` — convenção de pastas para spec/plan/tasks/architecture/protótipo por capacidade.
- `.claude/agents/README.md` — os agentes que executam o ciclo, e como pedir por eles.
- `.claude/skills/README.md` — origem e atribuição de cada skill importada.
