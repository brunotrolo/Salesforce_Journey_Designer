---
description: Quebra o plan.md de uma jornada em tasks.md executáveis.
---

Use a skill `sdd-workflow`. Argumento do usuário (qual spec): $ARGUMENTS

1. Localize `specs/<id>*/plan.md`. Se não existir, peça para rodar `/plan` primeiro.
2. Crie `specs/<id>*/tasks.md` a partir de `templates/tasks-template.md`.
3. Cada task deve ser pequena o bastante para um PR/change-set e nomear o artefato concreto (objeto, campo, OmniScript, FlexCard, componente LWC, Flow, classe Apex).
4. Ordene por dependência real (modelo de dados e segurança antes de automação/UI; UI antes de testes de UI; migração de dados antes de qualquer teste que dependa de dados migrados).
5. Não crie tasks para nada que não esteja no plan.md — se notar uma lacuna, aponte para o usuário em vez de preencher por conta própria.
