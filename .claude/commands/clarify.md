---
description: Resolve os marcadores [NEEDS CLARIFICATION] de um spec.md existente antes de planejar.
---

Use a skill `sdd-workflow`. Argumento do usuário (qual spec, ex. "001" ou o slug): $ARGUMENTS

1. Localize `specs/<id>*/spec.md`. Se não existir, pergunte qual jornada.
2. Liste todos os `[NEEDS CLARIFICATION: ...]` encontrados no arquivo.
3. Para cada um, decida se é algo que você pode inferir com segurança do restante do spec/constituição, ou se só o usuário pode responder — nesse caso use `AskUserQuestion` (agrupe perguntas relacionadas, até 4 por vez).
4. Atualize `spec.md` in-place com as respostas, removendo os marcadores resolvidos.
5. Se sobrar marcador sem resposta, mantenha-o e explique por que o spec não pode avançar para `/plan` ainda.
