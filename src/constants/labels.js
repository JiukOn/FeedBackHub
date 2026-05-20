export const AREA_LABELS = {
  programa_geral: "Plataforma Core",
  assistente_ia: "Assistente Virtual",
  analise_vendas: "Análise de Vendas",
  resumo_global: "Resumo Global",
  central_dados: "Central de Dados",
  jornada_usuario: "Jornada do Usuário",
  canais_integracoes: "APIs e Integrações",
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
