---
description: Gera o plan.md técnico de uma jornada a partir do spec.md já clarificado.
---

Use as skills `sdd-workflow`, `sf-fsc-migration` e `sf-ux-journey`. Argumento do usuário (qual spec): $ARGUMENTS

1. Localize `specs/<id>*/spec.md`. Se ainda tiver `[NEEDS CLARIFICATION]` sem resposta, pare e peça para rodar `/clarify` primeiro.
2. Crie `specs/<id>*/plan.md` a partir de `templates/plan-template.md`.
3. Preencha a seção de modelo de dados usando o mapeamento padrão de `sf-fsc-migration` como base, ajustando ao caso específico.
4. Para cada passo da jornada, aplique o processo de decisão de `sf-ux-journey` (LWC vs OmniScript vs FlexCard vs híbrido) e registre a pergunta decisiva que motivou a escolha.
5. Preencha segurança, automação de backend, migração de dados (se aplicável) e estratégia de testes.
6. Liste riscos/decisões em aberto explicitamente — não deixe implícito.
