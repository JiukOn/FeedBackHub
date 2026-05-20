const to100 = (v, max = 5) =>
  v != null ? Math.round(((v - 1) / (max - 1)) * 100) : null;

const avg = (arr) => {
  const valid = arr.filter((v) => v != null && !isNaN(v));
  if (!valid.length) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
};

/**
 * Calcula os scores compostos baseados nas respostas do feedback.
 * 
 * @param {Object} feedback - Objeto de feedback completo recebido da interface.
 * @returns {Object} Scores calculados (overall, usefulness, trust, contextQuality, adoption, risk).
 */
export function calculateScores(feedback) {
  const ratings = feedback.ratings || {};
  const classification = feedback.classification || {};
  const perception = feedback.perception || {};
  const actionability = feedback.actionability || {};
  const areaData = feedback.areaSpecific || {};

  const usefulnessScore = avg([
    to100(ratings.usefulness),
    to100(ratings.decisionSupport),
    to100(ratings.intentionToUse),
  ]);

  const trustScore = avg([to100(ratings.trust), to100(ratings.clarity), to100(ratings.safety)]);

  let completude = to100(ratings.clarity);
  if (areaData.summaryBroughtEssential)
    completude = to100(areaData.summaryBroughtEssential);

  let atualidade = to100(ratings.trust);
  if (areaData.dataSeemUpdated) atualidade = to100(areaData.dataSeemUpdated);
  if (areaData.outdatedInfo === "sim") atualidade = 0;

  const contextQualityScore = avg([
    to100(ratings.contextAdherence),
    completude,
    atualidade,
  ]);

  let encaixe = to100(ratings.intentionToUse);
  if (areaData.fitsRoutine) encaixe = to100(areaData.fitsRoutine);

  let friccao = to100(ratings.speed) != null ? to100(ratings.speed) : 50;
  if (areaData.reducesEffort === "adiciona") friccao = 0;
  if (areaData.reducesEffort === "reduz") friccao = 100;

  const adoptionScore = avg([to100(ratings.easeOfUse), encaixe, friccao]);

  const hasComplianceRisk =
    classification.impact === "gera_risco_compliance" ||
    classification.feedbackType === "risco_compliance" ||
    areaData.sensitiveDataRisk === "sim";
  const hasDataIssue =
    classification.feedbackType === "dado_incorreto" ||
    areaData.dataErrorBlocksUse === "sim_bloqueante";
  const badRecommendation =
    classification.feedbackType === "recomendacao_inadequada" ||
    actionability.intendedAction === "reprovaria_inadequada";
  const emotions = perception.emotions || [];
  const hasNegativeEmotion = emotions.some((e) =>
    ["frustracao", "desconfianca", "confusao", "sobrecarga"].includes(e),
  );

  let riskScore = 0;
  if (ratings.trust != null) riskScore += (5 - ratings.trust) * 10;
  if (ratings.safety != null) riskScore += (5 - ratings.safety) * 10;
  if (hasComplianceRisk) riskScore += 30;
  if (hasDataIssue) riskScore += 20;
  if (badRecommendation) riskScore += 15;
  if (hasNegativeEmotion) riskScore += 10;
  riskScore = Math.min(100, riskScore);

  const use = usefulnessScore || 0;
  const tru = trustScore || 0;
  const ctx = contextQualityScore || 0;
  const ado = adoptionScore || 0;
  const rsk = riskScore || 0;

  const overallComputed =
    use * 0.25 + tru * 0.25 + ctx * 0.2 + ado * 0.2 + (100 - rsk) * 0.1;

  let finalOverall = overallComputed;
  if (ratings.overallScore != null) {
    const userOverall = (ratings.overallScore / 10) * 100;
    finalOverall = (overallComputed + userOverall) / 2;
  }

  return {
    overall: Math.round(finalOverall),
    usefulness: usefulnessScore != null ? Math.round(usefulnessScore) : null,
    trust: trustScore != null ? Math.round(trustScore) : null,
    contextQuality:
      contextQualityScore != null ? Math.round(contextQualityScore) : null,
    adoption: adoptionScore != null ? Math.round(adoptionScore) : null,
    risk: Math.round(riskScore),
  };
}

/**
 * Classifica um feedback em categorias visuais (Crítico, Validado, etc).
 * 
 * @param {Object} scores - Scores calculados pela função calculateScores.
 * @param {Object} feedback - Objeto de feedback completo original.
 * @returns {Object} Objeto contendo label, color, icon e priority.
 */
export function classifyFeedback(scores, feedback) {
  const classification = feedback.classification || {};

  if (
    classification.severity === "bloqueante" ||
    scores.risk >= 70 ||
    classification.impact === "gera_risco_compliance"
  ) {
    return { label: "Crítico", color: "critical", icon: "⚠", priority: 0 };
  }
  if (scores.overall >= 70 && scores.trust < 50) {
    return {
      label: "Alta utilidade, baixa confiança",
      color: "warning",
      icon: "◉",
      priority: 1,
    };
  }
  if (scores.overall >= 70 && scores.adoption < 50) {
    return {
      label: "Barreira de adoção",
      color: "warning",
      icon: "◈",
      priority: 2,
    };
  }
  if (scores.overall >= 60 && scores.overall != null) {
    const emotions = feedback.perception?.emotions || [];
    if (emotions.includes("confusao") || emotions.includes("duvida")) {
      return {
        label: "Problema de UX / comunicação",
        color: "info",
        icon: "◎",
        priority: 3,
      };
    }
    return { label: "Validado", color: "success", icon: "◆", priority: 4 };
  }
  if (classification.feedbackType === "dado_incorreto") {
    return {
      label: "Problema de dados",
      color: "error",
      icon: "◇",
      priority: 1,
    };
  }
  return { label: "Requer atenção", color: "warning", icon: "◉", priority: 2 };
}

/**
 * Agrega as métricas de todos os feedbacks para o dashboard.
 * 
 * @param {Array} feedbacks - Array com todos os feedbacks carregados.
 * @returns {Object|null} Objeto com médias, contagens de emoções, severidade, etc., ou null se não houver feedbacks.
 */
export function aggregateMetrics(feedbacks) {
  if (!feedbacks.length) return null;

  const allScores = feedbacks.map((f) => calculateScores(f));

  const avgMetric = (key) => {
    const vals = allScores.map((s) => s[key]).filter((v) => v != null);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const emotionCounts = {};
  feedbacks.forEach((f) => {
    (f.perception?.emotions || []).forEach((e) => {
      emotionCounts[e] = (emotionCounts[e] || 0) + 1;
    });
  });

  const areaCounts = {};
  feedbacks.forEach((f) => {
    const area = f.feedbackContext?.evaluatedArea || "nao_informado";
    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });

  const severityCounts = { baixa: 0, media: 0, alta: 0, bloqueante: 0 };
  feedbacks.forEach((f) => {
    const s = f.classification?.severity;
    if (s && severityCounts[s] !== undefined) severityCounts[s]++;
  });

  const improvements = feedbacks
    .map((f) => f.qualitative?.mostImportantImprovement)
    .filter(Boolean);

  const classifications = feedbacks.map((f) =>
    classifyFeedback(calculateScores(f), f),
  );
  const criticalCount = classifications.filter(
    (c) => c.label === "Crítico",
  ).length;
  const validatedCount = classifications.filter(
    (c) => c.label === "Validado",
  ).length;

  return {
    total: feedbacks.length,
    avgOverall: avgMetric("overall"),
    avgUsefulness: avgMetric("usefulness"),
    avgTrust: avgMetric("trust"),
    avgContextQuality: avgMetric("contextQuality"),
    avgAdoption: avgMetric("adoption"),
    avgRisk: avgMetric("risk"),
    emotionCounts,
    areaCounts,
    severityCounts,
    criticalCount,
    validatedCount,
    improvements,
  };
}
