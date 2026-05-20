export const AREA_LABELS = {
  programa_geral: "Core Platform",
  chat_bionico: "AI Assistant",
  sales_coach: "Sales Analytics",
  briefing_720: "Global Briefing",
  dados_crm: "Data Hub / CRM",
  jornada_gerente: "User Journey",
  canais_integracoes: "API & Integrations",
  governanca: "Governança",
  performance: "Performance",
  treinamento: "Treinamento",
};

export const EMOTION_LABELS = {
  confianca: "Confiança",
  clareza: "Clareza",
  seguranca: "Segurança",
  satisfacao: "Satisfação",
  curiosidade: "Curiosidade",
  duvida: "Dúvida",
  confusao: "Confusão",
  frustracao: "Frustração",
  desconfianca: "Desconfiança",
  sobrecarga: "Sobrecarga",
  indiferenca: "Indiferença",
};

export const EMOTION_VALENCE = {
  confianca: "positive",
  clareza: "positive",
  seguranca: "positive",
  satisfacao: "positive",
  curiosidade: "positive",
  duvida: "neutral",
  confusao: "negative",
  frustracao: "negative",
  desconfianca: "negative",
  sobrecarga: "negative",
  indiferenca: "neutral",
};

export function getNPSLabel(score) {
  if (score == null) return null;
  if (score >= 9) return { label: "Promotor", className: "nps-label--promoter" };
  if (score >= 7) return { label: "Neutro", className: "nps-label--passive" };
  return { label: "Detrator", className: "nps-label--detractor" };
}
