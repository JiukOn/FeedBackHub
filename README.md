# ◆ Sistema de Feedback — Plataforma Alpha

> Aplicação React configurável para captura, classificação e análise de feedbacks da **Plataforma Alpha**. Transforma percepção do usuário em métricas de utilidade, confiança, contexto, adoção, risco e priorização de backlog.

---

## 📋 Visão Geral

O **Sistema de Feedback** é um portal que coleta feedbacks estruturados sobre a Plataforma Alpha, processando-os em **6 índices compostos** que orientam a evolução do produto, priorização de backlog e melhoria contínua da experiência.

### Principais Capacidades

| Recurso | Descrição |
|---------|-----------|
| **Formulário multi-step** | 5 etapas com validação, perguntas condicionais por frente e progresso visual |
| **Scoring inteligente** | 6 índices compostos calculados automaticamente (Utilidade, Confiança, Contexto, Adoção, Risco, Geral) |
| **Dashboard analítico** | Score rings, mapa de emoções, distribuição por frente/severidade, feedbacks expandíveis |
| **✦ Relatório com IA** | Geração de relatório executivo via Azure OpenAI — análise, recomendações e insights |
| **Privacy Scanner** | Detecção em tempo real de dados sensíveis (CPF, CNPJ, valores) — NFR-006 |
| **Segurança reforçada** | CSP, X-Frame-Options, DOMPurify sanitization, Referrer-Policy |
| **3 temas visuais** | Dark Industrial, Bone & Slate (claro), Neon Cyber |
| **Exportação** | JSON, CSV, NDJSON (Data Lake) e relatório IA (.md) com um clique |
| **Mock data seeder** | Dashboard pré-populado na primeira inicialização |

---

## 🏗️ Arquitetura do Projeto

```
feedbackhub/
├── public/
│   └── index.html              # HTML base com SEO, OG tags e favicon
├── src/
│   ├── config/                  # ⚙️ O coração configurável
│   │   ├── questions.js         # Steps, perguntas e lógica condicional
│   │   └── themes.js            # 3 temas (dark, light, neon) com CSS variables
│   ├── constants/
│   │   └── privacy.js           # NFR-006: regex, mensagens e scanner
│   ├── utils/                   # 🧠 Inteligência analítica
│   │   ├── scoring.js           # 6 índices compostos + classificação
│   │   ├── export.js            # Exportação JSON e CSV
│   │   └── aiReport.js          # ✦ Geração de relatório via Azure OpenAI
│   ├── store/                   # 💾 Estado e persistência
│   │   ├── feedbackStore.js     # CRUD localStorage (preparado para API)
│   │   └── ThemeContext.js      # Contexto React para temas
│   ├── mock/
│   │   └── feedbacks.js         # 5 feedbacks simulados para demo
│   ├── components/
│   │   ├── Header.js            # Navegação, temas, mobile nav
│   │   ├── AIReportModal.js     # ✦ Modal do relatório com IA
│   │   ├── FormFields.js        # Renderizadores de campo dinâmicos
│   │   └── ui/
│   │       └── index.js         # Button, Card, Badge, ScoreRing, etc.
│   ├── pages/                   # 📄 As 3 telas
│   │   ├── HomePage.js          # Landing com hero, features e CTA
│   │   ├── FormPage.js          # Formulário em 5 etapas
│   │   └── DashboardPage.js     # Dashboard analítico + IA
│   ├── App.js                   # Shell principal
│   ├── index.js                 # Entry point React
│   └── styles.css               # Design system completo (1670+ linhas)
├── scripts/
│   └── verify.js                  # Script de verificação automatizada (94+ checks)
├── docs/
│   ├── feedback_hub_test_log.txt  # Relatório de homologação
│   ├── ARCHITECTURE.md            # Documentação de arquitetura
│   └── SCORING.md                 # Metodologia de scoring
├── .env.example                   # Template de variáveis de ambiente
├── .env                           # Suas chaves (não committar)
├── package.json
└── README.md                      # Este arquivo
```

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd feedbackhub

# Instalar dependências
npm install

# Configurar variáveis de ambiente (obrigatório para IA)
cp .env.example .env
# Edite o .env com suas chaves do Azure OpenAI

# Iniciar o servidor de desenvolvimento
npm start
```

A aplicação será aberta em `http://localhost:3000`.  
> **Nota:** Na primeira inicialização, a aplicação irá popular o Dashboard automaticamente com dados simulados (mock) para que você possa explorar todas as métricas e gráficos sem precisar preencher vários formulários manualmente.

### Verificação Automatizada

```bash
npm run verify    # Executa 105+ checagens de integridade
```

### Deploy (GitHub Pages)

```bash
npm run deploy
```

---

## 📐 Sistema de Scoring

A aplicação calcula **6 índices compostos** a partir dos dados brutos de cada feedback:

| Índice | Fórmula | Descrição |
|--------|---------|-----------|
| **Utilidade** | `avg(usefulness, decisionSupport, intentionToUse)` | Valor percebido + apoio à decisão + intenção de uso |
| **Confiança** | `avg(trust, clarity, safety)` | Confiança + clareza + segurança percebida |
| **Contexto** | `avg(contextAdherence, completude*, atualidade*)` | Aderência + completude + atualidade percebida |
| **Adoção** | `avg(easeOfUse, encaixe*, fricção*)` | Facilidade + encaixe na rotina + baixa fricção |
| **Risco** | Acumulativo (0-100) | Dado incorreto + baixa confiança + compliance + recomendação inadequada |
| **Geral** | Ponderado | `0.25×Utilidade + 0.25×Confiança + 0.20×Contexto + 0.20×Adoção + 0.10×(100-Risco)` |

> \* Valores com asterisco são **context-aware**: quando o feedback inclui dados de frentes específicas (ex: `dataSeemUpdated` da Central de Dados ou `summaryBroughtEssential` do Resumo Global), esses dados substituem os proxies genéricos.

### Classificação Automática

Cada feedback é automaticamente classificado:

| Classificação | Condição |
|---------------|----------|
| ⚠ **Crítico** | Severidade bloqueante OU risco ≥ 70 OU compliance |
| ◉ **Alta utilidade, baixa confiança** | Overall ≥ 70 E trust < 50 |
| ◈ **Barreira de adoção** | Overall ≥ 70 E adoption < 50 |
| ◎ **Problema de UX** | Overall ≥ 60 com emoção de confusão/dúvida |
| ◆ **Validado** | Overall ≥ 60 sem problemas |
| ◇ **Problema de dados** | Tipo = dado_incorreto |
| ◉ **Requer atenção** | Demais casos |

---

## ⚙️ Configuração

### Adicionar uma Pergunta

Edite `src/config/questions.js`. Adicione um objeto no array `questions` do step desejado:

```javascript
{
  id: "novaPergu nta",
  label: "Sua nova pergunta aqui?",
  type: "rating5",    // select | multiselect | rating5 | rating10 | textarea | checkbox | emotion
  required: true,
  // showIf: (data) => data.role === "gerente",  // Condicional opcional
}
```

### Adicionar Perguntas por Frente

Edite `AREA_SPECIFIC_QUESTIONS` em `src/config/questions.js`:

```javascript
export const AREA_SPECIFIC_QUESTIONS = {
  assistente_ia: [
    { id: "novaMetrica", label: "Nova métrica do Assistente?", type: "rating5" }
  ],
  // ...
};
```

### Adicionar um Novo Tema

Edite `src/config/themes.js`. Adicione um objeto ao `THEMES`:

```javascript
meuTema: {
  id: "meuTema",
  label: "Meu Tema Custom",
  vars: {
    "--bg-primary": "#ffffff",
    "--accent": "#6366f1",
    // ... todas as CSS variables
  },
},
```

---

## ✦ Relatório com IA (Azure OpenAI)

O dashboard inclui um botão **"✦ Relatório IA"** que gera um relatório executivo completo usando Azure OpenAI.

### Configuração

1. Copie o template de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

2. Preencha o `.env` com suas credenciais:
   ```env
   REACT_APP_AZURE_OPENAI_ENDPOINT=https://seu-recurso.openai.azure.com
   REACT_APP_AZURE_OPENAI_KEY=sua-chave-aqui
   REACT_APP_AZURE_OPENAI_DEPLOYMENT=gpt-X-Y
   REACT_APP_AZURE_OPENAI_API_VERSION=YYYY-MM-DD-preview
   ```

3. Reinicie o servidor (`npm start`).

### O que o relatório gera

| Seção | Conteúdo |
|-------|----------|
| Resumo Executivo | Visão geral do cenário em 3-4 frases |
| Indicadores-Chave | Análise dos 6 índices compostos |
| Pontos Fortes | O que está funcionando bem |
| Pontos Críticos | Problemas e riscos identificados |
| Análise por Frente | Diagnóstico por área avaliada |
| Mapa Emocional | Interpretação das emoções dominantes |
| Recomendações | Top 5 ações concretas de melhoria |
| Conclusão | Parecer final sobre o programa |

> O relatório pode ser **copiado** ou **baixado como `.md`** diretamente do modal.

---

## 🔒 Privacidade e Compliance (NFR-006)

O sistema implementa proteção de dados em 3 camadas:

1. **Avisos visuais**: Mensagens de privacidade na Landing, no Formulário e na tela de Classificação.
2. **Scanner em tempo real**: Regex patterns detectam CPF, CNPJ, valores monetários, dados bancários e credenciais em campos de texto.
3. **Consentimento obrigatório**: O usuário deve confirmar via checkbox que não incluiu dados sensíveis antes de enviar.

---

## 💾 Persistência

A camada de dados é isolada em `src/store/feedbackStore.js`:

```javascript
saveFeedback(payload)
loadFeedbacks()
deleteFeedback(id)
exportFeedbacks()
clearFeedbacks()
getFeedbackById(id)
```

> **Hoje:** Persiste em `localStorage` para funcionar em GitHub Pages sem backend.  
> **Amanhã:** Troque as implementações por chamadas `fetch` para API/Azure Function **sem tocar nas telas**.

---

## 🎨 Design System

### Tipografia
- **Headings**: Syne (800/700/600)
- **Body**: Inter (400/500)
- **Code/Labels**: DM Mono (400/500)

### Cores (via CSS Variables)
Todos os componentes usam variáveis CSS definidas nos temas, garantindo consistência e troca instantânea.

### Componentes UI
- `Button` (primary, ghost, success, danger)
- `Card` (container padrão)
- `Badge` (accent, success, warning, error, info)
- `ProgressBar` (barras de progresso coloridas)
- `ScoreRing` (anéis SVG animados para scores)
- `Tooltip`, `Divider`

---

## 📱 Responsividade

A aplicação funciona em **qualquer dispositivo e orientação**:

| Breakpoint | Dispositivo | Adaptações |
|------------|-------------|------------|
| > 1024px | Desktop | Layout completo, nav horizontal, grids 2-3 colunas |
| ≤ 1024px | Tablet landscape | Grids flexíveis, scores com wrap |
| ≤ 768px | Tablet portrait | Título com `clamp()`, features 2 cols, dashboard 1 col |
| ≤ 640px | Mobile | Nav compacta (⌂ ✎ ◆), botões full-width, step labels ocultos |
| ≤ 380px | Phones pequenos | Tudo compactado: header 52px, ratings 26px |
| Landscape | Orientação horizontal | Hero/padding reduzidos |
| Print | Impressão | Sem header/footer, fundo branco |

---

## 🔐 Segurança

O sistema implementa múltiplas camadas de segurança:

| Camada | Mecanismo | Descrição |
|--------|-----------|----------|
| **CSP** | Content-Security-Policy | Bloqueia XSS, controla origens de scripts, estilos, fontes e conexões |
| **Sanitização** | DOMPurify | Todo HTML gerado pela IA é sanitizado antes da injeção no DOM |
| **Clickjacking** | X-Frame-Options: DENY | Impede que a aplicação seja embutida em iframes maliciosos |
| **MIME-Sniffing** | X-Content-Type-Options: nosniff | Previne interpretação incorreta de tipos de conteúdo |
| **Referrer** | Referrer-Policy: strict-origin | Controla informações enviadas no cabeçalho Referer |
| **Privacidade** | Privacy Scanner (NFR-006) | Detecção em tempo real de CPF, CNPJ, valores e credenciais |

---

## 📦 Exportação para Data Lake

A aplicação oferece 4 formatos de exportação:

| Formato | Extensão | Uso |
|---------|----------|-----|
| **JSON** | `.json` | Integração com APIs, debugging, visualização estruturada |
| **CSV** | `.csv` | Planilhas (Excel, Google Sheets), análise ad-hoc |
| **NDJSON** | `.ndjson` | Ingestão em Data Lakes (BigQuery, Athena, Snowflake, Databricks) |
| **Markdown** | `.md` | Relatório executivo gerado pela IA |

> O formato **NDJSON** (Newline Delimited JSON) é o padrão da indústria para ingestão massiva de dados. Cada linha contém um documento JSON completo, permitindo streaming e processamento paralelo.

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Faça as alterações respeitando a arquitetura existente
3. Teste localmente com `npm start`
4. Envie um PR com descrição detalhada

---

## 📄 Licença

Uso interno — Plataforma Alpha.

---

<div align="center">
  <strong>◆ Sistema de Feedback</strong> · Plataforma Alpha · v1.2.0
</div>
