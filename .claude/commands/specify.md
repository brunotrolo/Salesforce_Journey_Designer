---
description: Cria o spec.md de uma nova jornada (Service Cloud → FSC) seguindo o fluxo SDD do projeto.
---

Use a skill `sdd-workflow` para conduzir este passo. Argumentos do usuário (nome/descrição da jornada): $ARGUMENTS

1. Verifique `docs/sdd/constitution.md` — se houver `[NEEDS CLARIFICATION]` nas seções 1–2 (modelo de conta, licenciamento), avise o usuário que a fundação precisa ser resolvida antes de specs de jornada, mas prossiga se ele pedir explicitamente mesmo assim (ex.: spec exploratório).
2. Descubra o próximo `NNN` olhando os diretórios existentes em `specs/`.
3. Crie `specs/NNN-<slug>/spec.md` a partir de `templates/spec-template.md`, preenchido com o que o usuário descreveu.
4. Não invente regras de negócio ou cenários que o usuário não mencionou — marque como `[NEEDS CLARIFICATION: ...]` em vez de assumir.
5. Ao final, liste os pontos marcados como `NEEDS CLARIFICATION` para o usuário resolver (ou sugira rodar `/clarify`).
