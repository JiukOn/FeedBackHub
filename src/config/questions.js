export const FORM_STEPS = [
  {
    id: "context",
    label: "Contexto",
    icon: "◉",
    title: "Quem é você e o que está avaliando?",
    description:
      "Essas informações ajudam a categorizar o feedback corretamente.",
    questions: [
      {
        id: "role",
        label: "Qual é o seu perfil?",
        type: "select",
        required: true,
        options: [
          { value: "gerente", label: "Gerente" },
          { value: "especialista", label: "Especialista" },
          { value: "gestor", label: "Coordenador / Gestor" },
          { value: "negocio", label: "Área de Negócio" },
          { value: "produto", label: "Produto" },
          { value: "tecnologia", label: "Tecnologia" },
          { value: "dados_ia", label: "Dados / IA" },
          { value: "governanca_compliance", label: "Governança / Compliance" },
          { value: "operacoes", label: "Operações" },
          { value: "outro", label: "Outro" },
        ],
      },
      {
        id: "segment",
        label: "Segmento de atuação",
        type: "select",
        required: false,
        options: [
          { value: "pf", label: "PF — Pessoa Física" },
          { value: "select", label: "Select" },
          { value: "pj", label: "PJ — Pessoa Jurídica" },
          { value: "loja_fisica", label: "Loja Física" },
          { value: "canais_digitais", label: "Canais Digitais" },
          { value: "interno", label: "Interno / Corporativo" },
          { value: "nao_informado", label: "Prefiro não informar" },
        ],
      },
      {
        id: "usageFrequency",
        label: "Qual é a sua frequência de contato com o programa?",
        type: "select",
        required: true,
        options: [
          { value: "primeiro_contato", label: "Primeiro contato hoje" },
          { value: "poucas_vezes", label: "Usei poucas vezes" },
          { value: "semanal", label: "Uso semanalmente" },
          { value: "diario", label: "Uso diariamente" },
          {
            value: "avaliando_conceito",
            label: "Estou avaliando o conceito / protótipo",
          },
        ],
      },
      {
        id: "evaluatedArea",
        label: "Sobre qual parte da Nexus Platform você quer dar feedback?",
        type: "select",
        required: true,
        options: [
          { value: "programa_geral", label: "Plataforma Core" },
          { value: "assistente_ia", label: "Assistente Virtual" },
          { value: "analise_vendas", label: "Análise de Vendas" },
          { value: "resumo_global", label: "Resumo Global" },
          { value: "central_dados", label: "Central de Dados" },
          { value: "jornada_usuario", label: "Jornada do Usuário" },
          { value: "canais_integracoes", label: "APIs e Integrações" },
          { value: "governanca", label: "Governança" },
          { value: "performance", label: "Performance" },
          { value: "treinamento", label: "Treinamento / Comunicação" },
        ],
      },
      {
        id: "scenario",
        label: "Em qual contexto surgiu esse feedback?",
        type: "select",
        required: true,
        options: [
          { value: "teste_prototipo", label: "Teste de protótipo" },
          { value: "demonstracao", label: "Demonstração" },
          { value: "reuniao_desenho", label: "Reunião de desenho / workshop" },
          { value: "uso_piloto", label: "Uso real / piloto" },
          { value: "analise_tecnica", label: "Análise técnica" },
          { value: "conversa_usuario", label: "Conversa com usuário final" },
          { value: "outro", label: "Outro" },
        ],
      },
    ],
  },
  {
    id: "ratings",
    label: "Avaliação",
    icon: "◈",
    title: "Como você avalia essa experiência?",
    description:
      "Notas de 1 a 5. Seja direto — tanto o elogio quanto a crítica ajudam.",
    questions: [
      {
        id: "overallScore",
        label: "Avaliação geral da Nexus Platform neste ponto",
        type: "rating10",
        required: true,
        lowLabel: "Muito ruim",
        highLabel: "Excelente",
      },
      {
        id: "recommendationScore",
        label: "Você recomendaria essa solução para outro gerente ou área?",
        type: "rating10",
        required: false,
        lowLabel: "Jamais",
        highLabel: "Com certeza",
      },
      {
        id: "usefulness",
        label: "Utilidade para a rotina do gerente",
        type: "rating5",
        required: true,
      },
      {
        id: "trust",
        label: "Confiança na informação ou recomendação apresentada",
        type: "rating5",
        required: true,
      },
      {
        id: "clarity",
        label: "Clareza e facilidade de entender",
        type: "rating5",
        required: true,
      },
      {
        id: "contextAdherence",
        label: "Aderência ao contexto do cliente ou jornada",
        type: "rating5",
        required: true,
      },
      {
        id: "decisionSupport",
        label: "A solução ajuda a tomar decisões melhores ou mais rápidas?",
        type: "rating5",
        required: true,
      },
      {
        id: "easeOfUse",
        label: "Simplicidade de uso",
        type: "rating5",
        required: true,
      },
      {
        id: "safety",
        label: "Segurança para uso comercial",
        type: "rating5",
        required: true,
      },
      {
        id: "speed",
        label: "Velocidade / tempo de resposta",
        type: "rating5",
        required: false,
      },
      {
        id: "intentionToUse",
        label: "Intenção de usar na prática",
        type: "rating5",
        required: true,
      },
    ],
  },
  {
    id: "perception",
    label: "Percepção",
    icon: "◎",
    title: "Como você se sentiu?",
    description:
      "Emoções e percepções ajudam a identificar barreiras de adoção que as notas não capturam.",
    questions: [
      {
        id: "emotions",
        label:
          "Qual sentimento melhor descreve sua experiência? (escolha até 2)",
        type: "emotion",
        required: true,
        maxSelections: 2,
        options: [
          {
            value: "confianca",
            label: "Confiança",
            color: "success",
            description: "Pode usar",
          },
          {
            value: "clareza",
            label: "Clareza",
            color: "info",
            description: "Entendeu o valor",
          },
          {
            value: "seguranca",
            label: "Segurança",
            color: "success",
            description: "Há controle",
          },
          {
            value: "satisfacao",
            label: "Satisfação",
            color: "success",
            description: "Experiência positiva",
          },
          {
            value: "curiosidade",
            label: "Curiosidade",
            color: "info",
            description: "Quer explorar mais",
          },
          {
            value: "duvida",
            label: "Dúvida",
            color: "warning",
            description: "Valor ainda incerto",
          },
          {
            value: "confusao",
            label: "Confusão",
            color: "warning",
            description: "Não entendeu o fluxo",
          },
          {
            value: "frustracao",
            label: "Frustração",
            color: "error",
            description: "Algo atrapalhou",
          },
          {
            value: "desconfianca",
            label: "Desconfiança",
            color: "error",
            description: "Questiona dado ou IA",
          },
          {
            value: "sobrecarga",
            label: "Sobrecarga",
            color: "warning",
            description: "Parece adicionar trabalho",
          },
          {
            value: "indiferenca",
            label: "Indiferença",
            color: "muted",
            description: "Valor não foi percebido",
          },
        ],
      },
      {
        id: "emotionIntensity",
        label: "Qual foi a intensidade desse sentimento?",
        type: "rating5",
        required: true,
        lowLabel: "Leve",
        highLabel: "Muito forte",
      },
      {
        id: "intendedAction",
        label:
          "Diante dessa experiência, o que você faria com essa recomendação?",
        type: "select",
        required: true,
        options: [
          { value: "usaria_como_esta", label: "Usaria como está" },
          { value: "usaria_com_ajustes", label: "Usaria, mas ajustaria antes" },
          {
            value: "usaria_como_apoio",
            label: "Usaria como apoio, não como decisão final",
          },
          { value: "ignoraria", label: "Ignoraria" },
          {
            value: "reprovaria_inadequada",
            label: "Reprovaria — está inadequada",
          },
          { value: "nao_consegui_avaliar", label: "Não consegui avaliar" },
        ],
      },
      {
        id: "rejectionReason",
        label: "Qual o principal motivo para não usar diretamente?",
        type: "select",
        required: false,
        showIf: (data) =>
          ["usaria_com_ajustes", "ignoraria", "reprovaria_inadequada"].includes(
            data.intendedAction,
          ),
        options: [
          { value: "dado_desatualizado", label: "Dado desatualizado" },
          { value: "dado_incorreto", label: "Dado incorreto" },
          { value: "faltou_contexto", label: "Faltou contexto do cliente" },
          { value: "faltou_racional", label: "Faltou explicação do racional" },
          {
            value: "recomendacao_fraca",
            label: "Recomendação comercial fraca",
          },
          { value: "regra_negocio", label: "Não aderente à regra de negócio" },
          {
            value: "momento_cliente",
            label: "Não aderente ao momento do cliente",
          },
          { value: "risco_compliance", label: "Risco de compliance" },
          { value: "fluxo_confuso", label: "Fluxo confuso" },
          { value: "tempo_resposta", label: "Tempo de resposta ruim" },
          {
            value: "nao_encaixa_rotina",
            label: "Não encaixa na rotina do gerente",
          },
          { value: "outro", label: "Outro" },
        ],
      },
    ],
  },
  {
    id: "qualitative",
    label: "Detalhes",
    icon: "◇",
    title: "Nos conte mais",
    description:
      "Campos abertos. Não informe dados pessoais de clientes, CPF, conta, valores ou informações confidenciais.",
    privacyWarning: true,
    questions: [
      {
        id: "whatWorked",
        label: "O que funcionou bem?",
        type: "textarea",
        required: false,
        placeholder: "Descreva o que você achou positivo nessa experiência...",
      },
      {
        id: "whatToImprove",
        label: "O que precisa melhorar?",
        type: "textarea",
        required: false,
        placeholder:
          "Seja específico: o que atrapalhou ou ficou aquém do esperado?",
      },
      {
        id: "missingContext",
        label: "Qual informação, dado ou contexto estava faltando?",
        type: "textarea",
        required: false,
        placeholder:
          "Ex: faltou histórico de contato, saldo, comportamento recente...",
      },
      {
        id: "incorrectOrRiskyInfo",
        label: "Houve algo incorreto, desatualizado ou com risco?",
        type: "textarea",
        required: false,
        placeholder: "Descreva sem informar dados reais de clientes...",
      },
      {
        id: "mostImportantImprovement",
        label:
          "Qual seria a melhoria mais importante para tornar isso útil na rotina?",
        type: "textarea",
        required: false,
        placeholder: "Se você pudesse mudar uma coisa, qual seria?",
      },
      {
        id: "realUseCaseExample",
        label: "Descreva um caso real em que essa solução poderia ajudar",
        type: "textarea",
        required: false,
        placeholder:
          "Sem dados de clientes. Descreva o cenário de forma genérica...",
      },
    ],
  },
  {
    id: "classification",
    label: "Classificação",
    icon: "◆",
    title: "Classifique este feedback",
    description:
      "Isso ajuda a priorizar o backlog e direcionar para o time certo.",
    questions: [
      {
        id: "feedbackType",
        label: "Qual é o tipo principal deste feedback?",
        type: "select",
        required: true,
        options: [
          { value: "experiencia", label: "Experiência de uso" },
          { value: "ideia_melhoria", label: "Ideia de melhoria" },
          { value: "bug", label: "Problema / Bug" },
          { value: "dado_incorreto", label: "Dado incorreto ou desatualizado" },
          {
            value: "recomendacao_inadequada",
            label: "Recomendação inadequada",
          },
          { value: "duvida", label: "Dúvida" },
          { value: "risco_compliance", label: "Risco / Compliance" },
          { value: "elogio", label: "Elogio" },
          { value: "outro", label: "Outro" },
        ],
      },
      {
        id: "severity",
        label: "Qual é a severidade?",
        type: "select",
        required: true,
        options: [
          {
            value: "baixa",
            label: "Baixa — informativo, sem impacto imediato",
          },
          { value: "media", label: "Média — atrapalha, mas tem contorno" },
          { value: "alta", label: "Alta — impacta a operação ou gera risco" },
          {
            value: "bloqueante",
            label: "Bloqueante — impede o uso ou é crítico",
          },
        ],
      },
      {
        id: "impact",
        label: "Qual é o impacto operacional?",
        type: "select",
        required: true,
        options: [
          { value: "informativo", label: "Informativo" },
          { value: "atrapalha_uso", label: "Atrapalha o uso" },
          { value: "gera_risco_comercial", label: "Gera risco comercial" },
          { value: "gera_risco_compliance", label: "Gera risco de compliance" },
          { value: "impede_operacao", label: "Impede a operação" },
        ],
      },
      {
        id: "privacyConsent",
        label:
          "Confirmo que não incluí dados pessoais de clientes, informações sigilosas, credenciais ou conteúdo confidencial neste feedback.",
        type: "checkbox",
        required: true,
      },
      {
        id: "allowContact",
        label:
          "Autorizo contato para esclarecimentos sobre este feedback (opcional)",
        type: "checkbox",
        required: false,
      },
      {
        id: "contactEmail",
        label: "E-mail corporativo para retorno",
        type: "textarea",
        required: false,
        showIf: (data) => data.allowContact === true,
        placeholder: "seu.email@empresa.com.br",
        rows: 1,
      },
    ],
  },
];

export const AREA_SPECIFIC_QUESTIONS = {
  assistente_ia: [
    {
      id: "chatAnsweredExactly",
      label: "O Chat respondeu exatamente o que você perguntou?",
      type: "rating5",
      required: false,
    },
    {
      id: "chatBroughtContext",
      label: "A resposta trouxe fonte, contexto ou justificativa suficiente?",
      type: "rating5",
      required: false,
    },
    {
      id: "chatShouldEscalate",
      label: "O Chat deveria ter escalado para humano nesse caso?",
      type: "select",
      required: false,
      options: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
        { value: "nao_sei", label: "Não sei avaliar" },
      ],
    },
  ],
  analise_vendas: [
    {
      id: "recommendationActionable",
      label: "A recomendação era acionável?",
      type: "rating5",
      required: false,
    },
    {
      id: "pitchMadeSense",
      label: "O argumento de venda fazia sentido para o perfil do cliente?",
      type: "rating5",
      required: false,
    },
    {
      id: "rationalClear",
      label: "O racional da recomendação estava claro?",
      type: "rating5",
      required: false,
    },
    {
      id: "respectsPolicy",
      label: "A recomendação respeitava regra de produto e política comercial?",
      type: "rating5",
      required: false,
    },
  ],
  resumo_global: [
    {
      id: "summaryBroughtEssential",
      label: "O resumo trouxe o contexto mais importante?",
      type: "rating5",
      required: false,
    },
    {
      id: "outdatedInfo",
      label: "Havia informação desatualizada no briefing?",
      type: "select",
      required: false,
      options: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
        { value: "nao_sei", label: "Não identifiquei" },
      ],
    },
    {
      id: "briefingHelpsNextAction",
      label: "O briefing ajudaria a priorizar a próxima ação com o cliente?",
      type: "rating5",
      required: false,
    },
  ],
  central_dados: [
    {
      id: "dataSeemCorrect",
      label: "O dado parecia correto?",
      type: "rating5",
      required: false,
    },
    {
      id: "dataSeemUpdated",
      label: "O dado parecia atualizado?",
      type: "rating5",
      required: false,
    },
    {
      id: "dataErrorBlocksUse",
      label: "O erro de dado impediria o uso da solução?",
      type: "select",
      required: false,
      options: [
        { value: "sim_bloqueante", label: "Sim, é bloqueante" },
        { value: "parcialmente", label: "Parcialmente" },
        { value: "nao", label: "Não, é contornável" },
      ],
    },
  ],
  governanca: [
    {
      id: "riskOfWrongRec",
      label: "Existe risco de recomendação indevida?",
      type: "select",
      required: false,
      options: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
        { value: "possivel", label: "Possível — precisa avaliar" },
      ],
    },
    {
      id: "humanResponsibilityClear",
      label:
        "A solução deixa claro que o humano é responsável pela decisão final?",
      type: "rating5",
      required: false,
    },
    {
      id: "sensitiveDataRisk",
      label: "Há risco de exposição de dado sensível?",
      type: "select",
      required: false,
      options: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
        { value: "nao_sei", label: "Não consegui avaliar" },
      ],
    },
  ],
  jornada_usuario: [
    {
      id: "reducesEffort",
      label: "A solução reduz esforço ou adiciona mais uma tela?",
      type: "select",
      required: false,
      options: [
        { value: "reduz", label: "Reduz esforço" },
        { value: "neutro", label: "Neutro" },
        { value: "adiciona", label: "Adiciona mais uma tela / etapa" },
      ],
    },
    {
      id: "fitsRoutine",
      label: "O fluxo encaixa na rotina comercial?",
      type: "rating5",
      required: false,
    },
  ],
};
