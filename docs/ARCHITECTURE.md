# Arquitetura Técnica — Feedback Hub

## Visão Geral

O Feedback Hub segue uma arquitetura de **aplicação SPA (Single Page Application)** baseada em React, com separação clara de responsabilidades em camadas.

```
┌─────────────────────────────────────────────────┐
│                   BROWSER                       │
├─────────────────────────────────────────────────┤
│  Pages (HomePage, FormPage, DashboardPage)      │  ← Telas/Views
│  ┌────────────────────────────────────────────┐ │
│  │  Components (Header, FormFields, UI)       │ │  ← Componentes visuais
│  └────────────────────────────────────────────┘ │
│  ┌──────────────┐  ┌───────────────┐           │
│  │  Config       │  │  Constants    │           │  ← Configuração
│  │  (questions,  │  │  (privacy)    │           │
│  │   themes)     │  │               │           │
│  └──────────────┘  └───────────────┘           │
│  ┌──────────────┐  ┌───────────────┐           │
│  │  Utils        │  │  Store        │           │  ← Lógica/Persistência
│  │  (scoring,    │  │  (feedback,   │           │
│  │   export)     │  │   theme ctx)  │           │
│  └──────────────┘  └───────────────┘           │
│  ┌──────────────┐                               │
│  │  Mock         │                               │  ← Dados simulados
│  │  (feedbacks)  │                               │
│  └──────────────┘                               │
├─────────────────────────────────────────────────┤
│              localStorage (persistência)        │  ← Hoje
│              API / Azure Function               │  ← Amanhã (drop-in)
└─────────────────────────────────────────────────┘
```

## Camadas

### 1. Config (`src/config/`)

Contém toda a informação declarativa da aplicação:

- **`questions.js`**: Define os 5 steps do formulário, cada pergunta, seus tipos, opções e regras condicionais (`showIf`). Também define `AREA_SPECIFIC_QUESTIONS` — perguntas extras por frente avaliada.
- **`themes.js`**: Define os temas visuais como objetos com CSS variables. Adicionar um tema novo é adicionar um objeto.

### 2. Constants (`src/constants/`)

- **`privacy.js`**: Centraliza todas as regras de privacidade (NFR-006):
  - Mensagens padronizadas (warning, consent, block)
  - Expressões regulares para detecção de dados sensíveis
  - Função `scanTextForSensitiveData(text)` retorna array de labels encontrados

### 3. Utils (`src/utils/`)

- **`scoring.js`**: Motor analítico da aplicação.
  - `calculateScores(feedback)` → calcula os 6 índices compostos
  - `classifyFeedback(scores, feedback)` → classifica em categorias de prioridade
  - `aggregateMetrics(feedbacks[])` → agrega métricas para o dashboard
- **`export.js`**: Exportação de dados em JSON e CSV com download automático.

### 4. Store (`src/store/`)

- **`feedbackStore.js`**: Camada de persistência isolada.
  - API: `saveFeedback`, `loadFeedbacks`, `deleteFeedback`, `exportFeedbacks`, `clearFeedbacks`, `getFeedbackById`
  - Auto-seed: na primeira carga, popula com dados mock
  - **Ponto de evolução**: trocar implementações por `fetch()` sem tocar em componentes
- **`ThemeContext.js`**: React Context para gerenciar tema ativo, aplicar CSS variables no `:root` e persistir preferência no localStorage.

### 5. Mock (`src/mock/`)

- **`feedbacks.js`**: 5 feedbacks ultra-realistas simulando cenários típicos:
  - Elogio ao Sales Analytics (gerente, nota 9)
  - Crítica de alucinação (assessor, nota 2, RISCO CRÍTICO)
  - Feature request para User Journey (especialista, nota 7)
  - Elogio ao Global Briefing (gestor, nota 8)
  - Problema de UX no AI Assistant (gerente, nota 6)

### 6. Components (`src/components/`)

- **`Header.js`**: Navegação principal, mobile nav, seletor de temas
- **`FormFields.js`**: Renderizadores dinâmicos para 7 tipos de campo (select, multiselect, emotion, rating5, rating10, textarea, checkbox)
- **`ui/index.js`**: Componentes base (Button, Card, Badge, ProgressBar, ScoreRing, Tooltip, Divider)

### 7. Pages (`src/pages/`)

- **`HomePage.js`**: Landing page com hero, features grid, area tags, CTA
- **`FormPage.js`**: Wizard multi-step com validação, privacy scanner e confirmação
- **`DashboardPage.js`**: Dashboard analítico com scores, emoções, distribuição, melhorias e feedbacks expandíveis

## Fluxo de Dados

```
Usuário preenche FormPage
         │
         ▼
   buildPayload()          ← Estrutura o feedback como JSON padronizado
         │
         ▼
   validateStep()          ← Valida campos obrigatórios + privacy scanner
         │
         ▼
   saveFeedback(payload)   ← Persiste no localStorage via feedbackStore
         │
         ▼
   DashboardPage           ← loadFeedbacks() → aggregateMetrics()
         │                    calculateScores() para cada feedback
         ▼                    classifyFeedback() para classificação
   Renderiza UI            ← ScoreRings, emoções, barras, feedbacks expandíveis
```

## Decisões de Design

1. **Sem roteador**: Navegação via `useState(page)` no App.js — suficiente para SPA simples, evita dependência extra.
2. **CSS Variables para temas**: Permite troca instantânea sem re-render de componentes.
3. **Config-driven forms**: Perguntas definidas como dados, não como JSX. Facilita adição sem código.
4. **Scoring isolado**: Fórmulas centralizadas em um arquivo. Ajuste de pesos sem tocar na UI.
5. **Store como abstração**: Interface CRUD simula backend. Migração para API real requer zero alteração nas pages.
