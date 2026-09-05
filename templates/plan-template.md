# Plan: <Nome da Jornada>

- **Spec de origem**: `spec.md`
- **Status**: draft | approved | in-progress | done

## 1. Modelo de dados (Service Cloud → FSC)

| Objeto/campo origem (Service Cloud) | Objeto/campo destino (FSC) | Transformação | Observações |
|---|---|---|---|

> Ver skill `sf-fsc-migration` para o mapeamento padrão (Account/Contact → Household/Person Account, custom "policy" → Financial Account/Holding, etc.)

## 2. Passo a passo da jornada e escolha de tecnologia de UI

| Passo | Persona | Abordagem (LWC / OmniScript / FlexCard / híbrido) | Pergunta decisiva (ver skill `sf-ux-journey`) | Artefato concreto |
|---|---|---|---|---|

## 3. Automação de backend

- Flows:
- Apex (apenas onde Flow/OmniStudio não é suficiente — justificar):
- Integration Procedures / DataRaptors:
- Integrações externas (sistemas de core bancário/seguros, etc.):

## 4. Modelo de segurança

- Sharing rules / OWD impactados:
- Permission sets / permission set groups:
- Action Plans (se aplicável):
- Considerações de compliance/LGPD sobre dados financeiros expostos nesta jornada:

## 5. Migração de dados (se esta jornada depende de dados legados)

- Ver `data-mapping.md` desta pasta (campo a campo) se aplicável.
- Estratégia: big-bang vs incremental vs paralelo.

## 6. Estratégia de testes

- Testes Apex (se houver Apex):
- Testes Jest (LWC):
- Validação funcional de OmniScript/FlexCard (roteiro manual ou Selenium/UTAM):
- Critério de aceite ligado aos cenários do spec.md:

## 7. Riscos e decisões em aberto

-
