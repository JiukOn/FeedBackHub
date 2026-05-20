# Metodologia de Scoring — Feedback Hub

## Resumo Executivo

O sistema de scoring transforma respostas subjetivas em **6 índices numéricos** (0-100) que permitem:
- Comparar feedbacks entre frentes avaliadas
- Identificar automaticamente pontos críticos
- Priorizar o backlog de melhorias
- Monitorar evolução ao longo do tempo

---

## Normalização

Todas as notas de escala 1-5 são convertidas para 0-100 usando:

```
score = ((valor - 1) / (máximo - 1)) × 100
```

| Nota (1-5) | Score (0-100) |
|:----------:|:-------------:|
| 1          | 0             |
| 2          | 25            |
| 3          | 50            |
| 4          | 75            |
| 5          | 100           |

---

## 1. Índice de Utilidade

**Racional**: Mede o quanto o usuário percebe valor real na solução para sua rotina.

```
Utilidade = média(
  valor_percebido,      ← ratings.usefulness
  apoio_à_decisão,      ← ratings.decisionSupport
  intenção_de_uso       ← ratings.intentionToUse
)
```

### Interpretação
- **80-100**: Ferramenta percebida como essencial
- **60-79**: Útil, mas com espaço para melhorias
- **40-59**: Valor questionável ou parcial
- **0-39**: Não percebe utilidade significativa

---

## 2. Índice de Confiança

**Racional**: Mede o quanto o usuário confia nas informações e recomendações da IA.

```
Confiança = média(
  confiança_geral,      ← ratings.trust
  clareza,              ← ratings.clarity
  segurança_percebida   ← ratings.safety
)
```

### Interpretação
- **80-100**: Confiança plena para uso direto
- **60-79**: Confia com ressalvas; validação manual necessária
- **40-59**: Desconfiança parcial; barreira de adoção
- **0-39**: Baixa confiança; risco de rejeição total

---

## 3. Índice de Contexto

**Racional**: Mede a qualidade do contexto apresentado — se os dados são aderentes, completos e atualizados.

```
Contexto = média(
  aderência_ao_contexto,    ← ratings.contextAdherence
  completude*,              ← ratings.clarity OU areaSpecific.summaryBroughtEssential
  atualidade*               ← ratings.trust OU areaSpecific.dataSeemUpdated
)
```

> **Context-aware**: Quando o feedback avalia frentes específicas como "Global Briefing" ou "Data Hub/CRM", os dados de perguntas específicas substituem os proxies genéricos. Por exemplo:
> - Para **Global Briefing**: usa `summaryBroughtEssential` como completude
> - Para **Dados/CRM**: usa `dataSeemUpdated` como atualidade; se `outdatedInfo === "sim"`, atualidade = 0

### Interpretação
- **80-100**: Contexto rico e atualizado
- **60-79**: Adequado mas incompleto
- **40-59**: Lacunas relevantes de contexto
- **0-39**: Contexto inadequado; compromete a utilidade

---

## 4. Índice de Adoção

**Racional**: Mede a facilidade de incorporar a solução na rotina comercial do gerente.

```
Adoção = média(
  facilidade_de_uso,    ← ratings.easeOfUse
  encaixe_na_rotina*,   ← ratings.intentionToUse OU areaSpecific.fitsRoutine
  baixa_fricção*        ← ratings.speed OU areaSpecific.reducesEffort
)
```

> **Context-aware**: Para a frente "User Journey":
> - `reducesEffort === "adiciona"` → fricção = 0
> - `reducesEffort === "reduz"` → fricção = 100

### Interpretação
- **80-100**: Encaixa naturalmente na rotina
- **60-79**: Precisa de ajustes para adoção plena
- **40-59**: Barreira significativa de adoção
- **0-39**: Adiciona trabalho em vez de simplificar

---

## 5. Índice de Risco

**Racional**: Identifica feedbacks com potencial de gerar danos operacionais, comerciais ou de compliance. **Quanto maior, pior.**

```
Risco = 0 (base)
  + (5 - trust) × 10                     ← Baixa confiança
  + (5 - safety) × 10                    ← Baixa segurança
  + 30 se compliance_risk                 ← Impacto compliance
  + 20 se dado_incorreto                 ← Dados errados
  + 15 se recomendação_inadequada        ← Recomendação ruim
  + 10 se emoção_negativa                ← Frustração, desconfiança, etc.
```

**Capped em 100.**

### Fontes de risco
| Fonte | Pontos | Origem |
|-------|:------:|--------|
| Baixa confiança (trust=1) | +40 | ratings.trust |
| Baixa segurança (safety=1) | +40 | ratings.safety |
| Risco de compliance | +30 | classification.impact ou feedbackType |
| Dado incorreto | +20 | classification.feedbackType ou areaSpecific |
| Recomendação inadequada | +15 | classification.feedbackType ou actionability |
| Emoção negativa | +10 | perception.emotions |

### Interpretação
- **0-20**: Risco baixo; feedback seguro
- **21-40**: Risco moderado; monitorar
- **41-60**: Risco significativo; ação necessária
- **61-80**: Risco alto; revisão prioritária
- **81-100**: Risco crítico; bloqueante

---

## 6. Índice Geral (Overall)

**Racional**: Composição ponderada que equilibra todos os índices anteriores.

```
Geral_Calculado = 0.25 × Utilidade
                + 0.25 × Confiança
                + 0.20 × Contexto
                + 0.20 × Adoção
                + 0.10 × (100 - Risco)
```

Se o usuário forneceu uma nota geral direta (`overallScore`, escala 0-10):
```
Geral_Final = (Geral_Calculado + (overallScore / 10 × 100)) / 2
```

> A média entre calculado e percepção do usuário evita que a fórmula desconsidere a impressão subjetiva holística.

### Pesos e Justificativa

| Componente | Peso | Justificativa |
|------------|:----:|---------------|
| Utilidade | 25% | Se não é útil, nada mais importa |
| Confiança | 25% | Sem confiança, não há adoção |
| Contexto | 20% | Qualidade do insumo que alimenta a IA |
| Adoção | 20% | Facilidade de incorporar na rotina |
| Inverso do Risco | 10% | Penalização por riscos identificados |

---

## Classificação Automática

Com base nos scores calculados, cada feedback recebe uma classificação:

```
SE severidade = "bloqueante" OU risco ≥ 70 OU compliance:
  → ⚠ Crítico (priority: 0)

SE overall ≥ 70 E trust < 50:
  → ◉ Alta utilidade, baixa confiança (priority: 1)

SE overall ≥ 70 E adoption < 50:
  → ◈ Barreira de adoção (priority: 2)

SE overall ≥ 60:
  SE emoções incluem confusão ou dúvida:
    → ◎ Problema de UX / comunicação (priority: 3)
  SENÃO:
    → ◆ Validado (priority: 4)

SE tipo = "dado_incorreto":
  → ◇ Problema de dados (priority: 1)

DEFAULT:
  → ◉ Requer atenção (priority: 2)
```

---

## Agregação para Dashboard

A função `aggregateMetrics(feedbacks[])` calcula:

- **Médias** de todos os 6 índices
- **Contagem de emoções** (mapa de sentimentos)
- **Distribuição por frente** (quantos feedbacks por área)
- **Distribuição por severidade** (baixa/média/alta/bloqueante)
- **Contagem de classificações** (validados vs críticos)
- **Top melhorias** (campos qualitativos mais citados)

---

## Evolução Futura

1. **Pesos dinâmicos**: Permitir que o Product Owner ajuste os pesos via interface
2. **Trending**: Comparar scores entre períodos (semana anterior vs atual)
3. **Benchmarking**: Scores por frente avaliada para comparação lateral
4. **Machine Learning**: Clustering de feedbacks similares para identificar padrões
