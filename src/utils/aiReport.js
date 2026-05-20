export function isAIConfigured() {
  const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
  const key = process.env.REACT_APP_AZURE_OPENAI_KEY;
  return Boolean(endpoint && key);
}

/**
 * Constrói o texto consolidado com o sumário dos feedbacks e métricas para ser enviado à IA.
 * 
 * @param {Array} feedbacks - Lista de feedbacks brutos.
 * @param {Object} metrics - Objeto de métricas gerado por aggregateMetrics.
 * @returns {string} Texto formatado contendo as informações relevantes para a IA.
 */
function buildFeedbackSummary(feedbacks, metrics) {
  const lines = [];

  lines.push("=== MÉTRICAS GERAIS ===");
  lines.push(`Total de feedbacks: ${metrics.total}`);
  lines.push(`Score Geral: ${metrics.avgOverall}/100`);
  lines.push(`Utilidade: ${metrics.avgUsefulness}/100`);
  lines.push(`Confiança: ${metrics.avgTrust}/100`);
  lines.push(`Contexto: ${metrics.avgContextQuality}/100`);
  lines.push(`Adoção: ${metrics.avgAdoption}/100`);
  lines.push(`Risco: ${metrics.avgRisk}/100`);
  lines.push(
    `Validados: ${metrics.validatedCount} | Críticos: ${metrics.criticalCount}`,
  );
  lines.push("");

  lines.push("=== DISTRIBUIÇÃO POR FRENTE ===");
  Object.entries(metrics.areaCounts).forEach(([area, count]) => {
    lines.push(`  ${area}: ${count} feedback(s)`);
  });
  lines.push("");

  lines.push("=== EMOÇÕES MAIS FREQUENTES ===");
  Object.entries(metrics.emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .forEach(([emotion, count]) => {
      lines.push(`  ${emotion}: ${count}x`);
    });
  lines.push("");

  lines.push("=== SEVERIDADE ===");
  Object.entries(metrics.severityCounts).forEach(([sev, count]) => {
    lines.push(`  ${sev}: ${count}`);
  });
  lines.push("");

  lines.push("=== FEEDBACKS INDIVIDUAIS ===");
  feedbacks.slice(0, 20).forEach((f, i) => {
    lines.push(`--- Feedback #${i + 1} ---`);
    lines.push(`Frente: ${f.feedbackContext?.evaluatedArea || "N/A"}`);
    lines.push(
      `Perfil: ${f.userProfile?.role || "N/A"} | Segmento: ${f.userProfile?.segment || "N/A"}`,
    );
    lines.push(`Nota geral: ${f.ratings?.overallScore ?? "N/A"}/10`);
    lines.push(`Recomendação: ${f.ratings?.recommendationScore ?? "N/A"}/10`);
    lines.push(
      `Tipo: ${f.classification?.feedbackType || "N/A"} | Severidade: ${f.classification?.severity || "N/A"}`,
    );

    if (f.perception?.emotions?.length) {
      lines.push(`Emoções: ${f.perception.emotions.join(", ")}`);
    }
    if (f.qualitative?.whatWorked) {
      lines.push(`O que funcionou: ${f.qualitative.whatWorked}`);
    }
    if (f.qualitative?.whatToImprove) {
      lines.push(`O que melhorar: ${f.qualitative.whatToImprove}`);
    }
    if (f.qualitative?.mostImportantImprovement) {
      lines.push(`Prioridade: ${f.qualitative.mostImportantImprovement}`);
    }
    if (f.qualitative?.incorrectOrRiskyInfo) {
      lines.push(`Risco/Incorreto: ${f.qualitative.incorrectOrRiskyInfo}`);
    }
    if (f.qualitative?.missingContext) {
      lines.push(`Contexto faltante: ${f.qualitative.missingContext}`);
    }
    lines.push("");
  });

  if (feedbacks.length > 20) {
    lines.push(
      `(+ ${feedbacks.length - 20} feedbacks omitidos por limite de contexto)`,
    );
  }

  return lines.join("\n");
}

/**
 * Chama a API do Azure OpenAI para gerar um relatório executivo.
 * 
 * @param {Array} feedbacks - Lista de feedbacks brutos.
 * @param {Object} metrics - Objeto de métricas gerado por aggregateMetrics.
 * @returns {Promise<string>} O conteúdo Markdown do relatório gerado.
 */
export async function generateAIReport(feedbacks, metrics) {
  const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
  const key = process.env.REACT_APP_AZURE_OPENAI_KEY;
  const deployment =
    process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini";
  const apiVersion =
    process.env.REACT_APP_AZURE_OPENAI_API_VERSION || "2024-08-01-preview";

  if (!endpoint || !key) {
    throw new Error(
      "Azure OpenAI não configurado. Preencha REACT_APP_AZURE_OPENAI_ENDPOINT e REACT_APP_AZURE_OPENAI_KEY no arquivo .env",
    );
  }

  const summary = buildFeedbackSummary(feedbacks, metrics);

  const systemPrompt = `Você é um analista sênior, encarregado de avaliar os feedbacks sobre o uso de ferramentas de IA no ambiente de trabalho.

Sua tarefa é gerar um relatório executivo completo baseado nos dados de feedback coletados. O relatório deve ser em Português do Brasil, profissional e acionável.

Estruture o relatório com as seguintes seções:

1. **Resumo Executivo** — Visão geral do cenário em 3-4 frases
2. **Indicadores-Chave** — Análise dos 6 índices (Utilidade, Confiança, Contexto, Adoção, Risco, Geral)
3. **Pontos Fortes** — O que está funcionando bem (baseado nos feedbacks positivos)
4. **Pontos Críticos** — Problemas e riscos identificados (baseado nos feedbacks negativos/críticos)
5. **Análise por Frente** — Breve análise de cada frente avaliada
6. **Mapa Emocional** — Interpretação das emoções dominantes e o que elas indicam
7. **Recomendações Prioritárias** — Top 5 ações concretas para melhoria, ordenadas por impacto
8. **Conclusão** — Parecer final sobre o estado do programa

Regras:
- Use linguagem executiva mas acessível
- Sempre baseie suas análises nos dados fornecidos
- Cite feedbacks específicos quando relevante (sem identificar pessoas)
- Não invente dados que não existem nos feedbacks
- Use emojis moderadamente para destaque visual (📊 📈 ⚠️ ✅ etc.)`;

  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Frentes de uso: Core Platform, AI Assistant, Sales Analytics, Global Briefing, Data Hub / CRM, User Journey, API & Integrations, Governança, Performance, Treinamento. Analise os seguintes dados de feedback e gere o relatório executivo completo:\n\n${summary}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[aiReport] Erro na API:", response.status, errorBody);
    throw new Error(
      `Erro ${response.status} na API Azure OpenAI. Verifique suas credenciais e deployment.`,
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Resposta vazia da API. Tente novamente.");
  }

  return content;
}
