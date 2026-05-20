import { v4 as uuid } from "uuid";

const MOCK_DATE = new Date().toISOString();

export const MOCK_FEEDBACKS = [
  {
    feedbackId: uuid(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    appVersion: "1.0.0",
    environment: "prototype",
    source: "seed",
    userProfile: {
      role: "gerente",
      segment: "select",
      usageFrequency: "semanal",
    },
    feedbackContext: { evaluatedArea: "analise_vendas", scenario: "uso_piloto" },
    ratings: {
      overallScore: 9,
      usefulness: 5,
      trust: 5,
      clarity: 4,
      contextAdherence: 5,
      decisionSupport: 5,
      easeOfUse: 4,
      safety: 5,
      speed: 4,
      intentionToUse: 5,
    },
    perception: { emotions: ["confianca", "satisfacao"], emotionIntensity: 4 },
    actionability: { intendedAction: "usaria_como_esta" },
    qualitative: {
      whatWorked:
        "O texto gerado veio super alinhado com o momento do cliente.",
      mostImportantImprovement:
        "Poderia incluir o link direto para contratação.",
    },
    areaSpecific: {
      recommendationActionable: 5,
      pitchMadeSense: 5,
      rationalClear: 4,
      respectsPolicy: 5,
    },
    classification: {
      feedbackType: "experiencia",
      severity: "baixa",
      impact: "informativo",
    },
  },
  {
    feedbackId: uuid(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    appVersion: "1.0.0",
    environment: "prototype",
    source: "seed",
    userProfile: {
      role: "especialista",
      segment: "pj",
      usageFrequency: "poucas_vezes",
    },
    feedbackContext: {
      evaluatedArea: "central_dados",
      scenario: "analise_tecnica",
    },
    ratings: {
      overallScore: 4,
      usefulness: 3,
      trust: 2,
      clarity: 5,
      contextAdherence: 2,
      decisionSupport: 3,
      easeOfUse: 4,
      safety: 4,
      speed: 5,
      intentionToUse: 3,
    },
    perception: {
      emotions: ["desconfianca", "frustracao"],
      emotionIntensity: 5,
    },
    actionability: {
      intendedAction: "usaria_com_ajustes",
      rejectionReason: "dado_incorreto",
    },
    qualitative: {
      whatToImprove:
        "O valor estimado estava muito diferente da realidade da empresa.",
      incorrectOrRiskyInfo: "Dados financeiros defasados.",
    },
    areaSpecific: {
      dataSeemCorrect: 2,
      dataSeemUpdated: 2,
      dataErrorBlocksUse: "sim_bloqueante",
    },
    classification: {
      feedbackType: "dado_incorreto",
      severity: "bloqueante",
      impact: "impede_operacao",
    },
  },
  {
    feedbackId: uuid(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    appVersion: "1.0.0",
    environment: "prototype",
    source: "seed",
    userProfile: {
      role: "governanca_compliance",
      segment: "interno",
      usageFrequency: "avaliando_conceito",
    },
    feedbackContext: {
      evaluatedArea: "governanca",
      scenario: "reuniao_desenho",
    },
    ratings: {
      overallScore: 6,
      usefulness: 4,
      trust: 3,
      clarity: 4,
      contextAdherence: 3,
      decisionSupport: 2,
      easeOfUse: 5,
      safety: 2,
      speed: 5,
      intentionToUse: 2,
    },
    perception: { emotions: ["duvida", "sobrecarga"], emotionIntensity: 3 },
    actionability: {
      intendedAction: "usaria_como_apoio",
      rejectionReason: "risco_compliance",
    },
    qualitative: {
      incorrectOrRiskyInfo:
        "A IA sugeriu um produto que não é mais ofertado, podendo gerar risco na oferta.",
      mostImportantImprovement: "Filtro mais rígido de produtos ativos.",
    },
    areaSpecific: {
      riskOfWrongRec: "sim",
      humanResponsibilityClear: 4,
      sensitiveDataRisk: "nao",
    },
    classification: {
      feedbackType: "risco_compliance",
      severity: "alta",
      impact: "gera_risco_compliance",
    },
  },
  {
    feedbackId: uuid(),
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    appVersion: "1.0.0",
    environment: "prototype",
    source: "seed",
    userProfile: { role: "gestor", segment: "pf", usageFrequency: "diario" },
    feedbackContext: { evaluatedArea: "resumo_global", scenario: "uso_piloto" },
    ratings: {
      overallScore: 8,
      usefulness: 5,
      trust: 4,
      clarity: 5,
      contextAdherence: 4,
      decisionSupport: 5,
      easeOfUse: 5,
      safety: 4,
      speed: 5,
      intentionToUse: 5,
    },
    perception: { emotions: ["clareza", "curiosidade"], emotionIntensity: 3 },
    actionability: { intendedAction: "usaria_como_esta" },
    qualitative: {
      whatWorked: "O resumo salvou 10 minutos de preparação para a reunião.",
    },
    areaSpecific: {
      summaryBroughtEssential: 5,
      outdatedInfo: "nao",
      briefingHelpsNextAction: 5,
    },
    classification: {
      feedbackType: "elogio",
      severity: "baixa",
      impact: "informativo",
    },
  },
  {
    feedbackId: uuid(),
    createdAt: MOCK_DATE,
    appVersion: "1.0.0",
    environment: "prototype",
    source: "seed",
    userProfile: {
      role: "gerente",
      segment: "pf",
      usageFrequency: "primeiro_contato",
    },
    feedbackContext: {
      evaluatedArea: "assistente_ia",
      scenario: "teste_prototipo",
    },
    ratings: {
      overallScore: 6,
      usefulness: 3,
      trust: 3,
      clarity: 2,
      contextAdherence: 3,
      decisionSupport: 3,
      easeOfUse: 4,
      safety: 4,
      speed: 3,
      intentionToUse: 3,
    },
    perception: { emotions: ["confusao"], emotionIntensity: 4 },
    actionability: {
      intendedAction: "ignoraria",
      rejectionReason: "fluxo_confuso",
    },
    qualitative: {
      whatToImprove:
        "A resposta veio muito longa, não consegui ler rápido durante o atendimento.",
      mostImportantImprovement: "Respostas curtas em bullet points.",
    },
    areaSpecific: {
      chatAnsweredExactly: 3,
      chatBroughtContext: 2,
      chatShouldEscalate: "nao",
    },
    classification: {
      feedbackType: "ideia_melhoria",
      severity: "media",
      impact: "atrapalha_uso",
    },
  },
];
