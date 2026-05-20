export const PRIVACY_MESSAGES = {
  warning:
    "Não informe dados pessoais de clientes, CPF, conta, valores, prints com dados sensíveis, credenciais ou informações confidenciais.",
  consent:
    "Confirmo que não incluí dados pessoais de clientes, informações sigilosas, credenciais ou conteúdo confidencial neste feedback.",
  block:
    "Atenção: Seu texto parece conter dados sensíveis (ex: CPF, valor em Reais, número de conta). Por favor, remova essas informações antes de enviar, conforme nossa política de privacidade (NFR-006).",
};

export const SENSITIVE_PATTERNS = [
  {
    regex: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
    label: "CPF",
  },

  {
    regex: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g,
    label: "CNPJ",
  },

  {
    regex: /\bR\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?\b/gi,
    label: "Valores financeiros",
  },

  {
    regex: /\b(ag[eê]ncia|conta|c\/c|poupan[çc]a)\s*:?\s*\d+/gi,
    label: "Dados bancários",
  },

  {
    regex: /\b(senha|password|pwd|credencial)\s*[:=]\s*\S+/gi,
    label: "Credenciais",
  },
];

export function scanTextForSensitiveData(text) {
  if (!text) return [];
  const found = new Set();

  SENSITIVE_PATTERNS.forEach(({ regex, label }) => {
    regex.lastIndex = 0;
    if (regex.test(text)) {
      found.add(label);
    }
  });

  return Array.from(found);
}
